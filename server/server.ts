import { getDataJSON, getRandomId } from "../src/utils";
import { FilterOptions } from "../src/Filter";
import { MediaFile } from "../src/storage";
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, rmdirSync, createWriteStream } from "fs";
import { join, parse } from "path";
import { executeFFMPEG, ffmpegPath } from "../src/ffmpeg";
import { storage, firestore } from "../src/firebase";
import { v1 as uuidv1} from 'uuid';
import { FiltersChain } from "../src/FilterChain";

const fileUpload = require('express-fileupload');
const express = require('express');

const app = express();

const SERVER_PORT = 1234;

app.use('/', express.static(__dirname + '/web'));
app.use('/media', express.static(__dirname + '/media'));
if(!existsSync('/media')) mkdirSync('media');
app.use(fileUpload());
const bodyParser = require('body-parser');
app.use(bodyParser.json())

const getFilters = (): Promise<FilterOptions[]> => getDataJSON('./dist/data/filters.json');

const mediaDirPath = './dist/server/media';
const waveformFilterComplexLine = `-filter_complex "showwavespic=s=1280x480:draw=full" -frames:v 1 -y`

app.post('/api/getWaveForm',  async (req: any, res: any) => {
    let data: any = req.body;
    let serverDir = join('.\\','dist', 'server');

    let fileDir = join(serverDir, data.fileUrl)
    let waveFormPath = join(fileDir+".png");

    if( existsSync(waveFormPath) ){
        res.send(
            {
                waveFormUrl: data.fileUrl+'.png',
                alreadyProcessed: true
            }
        );
    }else{
        let ffmpegCommand = [
            ffmpegPath, '-i', fileDir,
            waveformFilterComplexLine,
            waveFormPath
        ]
        console.log(ffmpegCommand.join(" "));
        console.log(ffmpegCommand);
        
        let process = await executeFFMPEG(ffmpegCommand)

    res.send(
            {
                waveFormUrl: data.fileUrl+'.png',
                processed: true,
                proccess: process
            }
        );
    }
})

app.post('/api/processAudio',  async (req: any, res: any) => {
    let data:  {media: MediaFile, filterChain: FiltersChain } =  req.body;
    let {media, filterChain} = data

    if(!data || !media || !filterChain){
        res.status(400).send('Some data is missing, check if all params are connected');
        return
    }else if(!filterChain.filterComplexLine){
        res.status(400).send('filterComplexLine not preprocessed, do that before bitch');
        return
    }
    
    let mediaDir = join(mediaDirPath, media.filename);
    let inputMediaPath = join(mediaDir, media.filename)
    
    let parsedFilename = parse(media.filename)
    let outputMediaPath = join(mediaDir, `${parsedFilename.name}.processed${parsedFilename.ext}`)

    console.log("Chain to work: ", filterChain.name, `(${filterChain.id})`);
    console.log("Processing: ", inputMediaPath, " => ", outputMediaPath);
    
    let ffmpegCommand = [
        ffmpegPath,
        '-i', inputMediaPath, // añade el archivo de entrada
        `-filter_complex "${filterChain.filterComplexLine}"`, // coloca los filtros uwu
        '-y', // sobreescribe si es que el archivo ya existe
        outputMediaPath // especificas el archivo de salida
    ]
    console.log(ffmpegCommand.join(" "));
    console.log(ffmpegCommand);
    
    let process = await executeFFMPEG(ffmpegCommand)
    if(process.error){
        console.error("ERROR: ", process.error);
        res.status(400).send({error: process.error});
        return
    }
    
    console.log("Processing ended");
    let output = process.output.filter(out => out != null).map(out => out.toString()).join('\n');
    media.processed = {
        localProcessedUrl: `media/${media.filename}/${parsedFilename.name}.processed${parsedFilename.ext}`,
        output
    }

    // GET THE WAVEFORM
    
    let outputWaveFormPath = `${outputMediaPath}.png`
    console.log("Getting Waveform from: ", outputMediaPath, " => ", outputWaveFormPath);
    let wavewformProcess = await executeFFMPEG([
        ffmpegPath, '-i', outputMediaPath,
        waveformFilterComplexLine,
        outputWaveFormPath
    ])
    if(!wavewformProcess.error) media.processed.localProcessedWaveform = `media/${media.filename}/${parsedFilename.name}.processed${parsedFilename.ext}.png`;

    res.send({
        media,
        inputMediaPath,
        outputMediaPath
    });
        
    /*
    let data: any = req.body;
    let serverDir = join('.\\','dist', 'server');

    let filtersLine = data.filtersLine;
    let fileDir = join(serverDir, data.fileUrl)
    let processedPath = join(fileDir+'.processed.mp3');


    let ffmpegCommand = [
        ffmpegPath,
        '-i',
        fileDir,
        '-filter_complex',
        '"',
        filtersLine,
        '"',
        '-y',
        processedPath
    ]
    console.log(ffmpegCommand.join(" "));
    console.log(ffmpegCommand);
    
    let t = await spawnSync("powershell.exe", ffmpegCommand);
    console.log(t.stdout.toString());
    console.log(t.output.toString());
    console.log(t.stderr.toString());

    res.send(
            {
                processedAudio: data.fileUrl+'.processed.mp3',
                ffmpegOutput: t.stdout.toString()
            }
        );
    
        */
})

app.get('/api/getLocalFiles', async (req: any, res: any) => {
    let localFiles: string[] = readdirSync(mediaDirPath)
    let localFilesData: MediaFile[] = [];
    localFiles.forEach( async localFile => {
        let localFileMetadataPath = join( mediaDirPath, localFile, 'metadata.json');
        try{
            let metadataData = readFileSync(localFileMetadataPath).toString()
            localFilesData.push( JSON.parse( metadataData ))
        }catch(e) {}
    })
    res.send({localFilesData});
})

app.post('/api/deleteFile', async (req: any, res: any) => {
    let fileToDelete: MediaFile = req.body.fileToDelete;
    if(!fileToDelete) {
        res.status(400).send({error: 'file not found'});
        return;
    }

    if(fileToDelete.status == 'local' || fileToDelete.status == 'firebase-local'){
        let pathToDelete = join(mediaDirPath, fileToDelete.filename)
        try{
            let out = rmdirSync(pathToDelete, { recursive: true });
            res.send({'status': 'deleted'})
        }catch(e){
            res.status(400).send({message: 'error on delete file, check if have permissions', error: e})
        }
        return
    }else if(fileToDelete.status == 'firebase'){
        storage.bucket.file(fileToDelete.filename).delete().then( async ()=> {

            await firestore.collection('storageMediaData').doc(fileToDelete.id).delete()

            res.status(200).send({'status': 'deleted'})

        }).catch( (reason: any) => {
            console.log("Error on delete bucket object: ", reason);
            res.status(400).send({error: reason})
        })
        return;
    }

    res.status(400).send({'status': 'file not found'})
    
})

app.post('/api/upload', function(req: any, res: any) {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send('No files were uploaded.');
    
    let reqFile = req.files.file;
  

    // adapt request file to program type MediaFile to be returned
    
    let file: MediaFile = {
        mimetype: reqFile.mimetype, 
        filename: reqFile.name,
        size: reqFile.size,
        uploadedTime: new Date(),
        id: getRandomId(),
        processed: {}
    }
    console.log(file);
  
    let filePath = join(mediaDirPath, file.filename);

    if(!existsSync(filePath)) mkdirSync(filePath)
    writeFileSync( join(filePath, 'metadata.json'), JSON.stringify(file))

    // Use the mv() method to place the file somewhere on your server
    reqFile.mv( join(filePath, file.filename) , function(err: any) {
      if (err) return res.status(500).send(err);
      res.send(file);
    });
  });

app.post('/api/uploadToFirebase', async (req: any, res: any) => {
    console.log(req.body);
    let file: MediaFile = req.body
    if(!file) {
        res.status(400).send({error: 'No file was uploaded.'})
        return;
    }
    delete file.processed;

    let filePath = join( mediaDirPath, file.filename, file.filename);
    let tokenUuid = uuidv1();

    let uploadResult = await storage.bucket.upload(filePath, {
        contentType: "media",
        metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: tokenUuid
            }
        }
    })
    let resultFile = uploadResult[0];

    console.log(resultFile);
    let downloadUrl = "https://firebasestorage.googleapis.com/v0/b/" + storage.bucket.name + "/o/" + encodeURIComponent(resultFile.name) + "?alt=media&token=" + tokenUuid

    
    file.downloadToken = tokenUuid;
    file.downloadUrl = downloadUrl;
    file.uploadedTime = new Date();

    file.status = 'firebase-local';

    let fileMetadataPath = join( mediaDirPath, file.filename, 'metadata.json');
    writeFileSync( fileMetadataPath, JSON.stringify(file))

    console.log(file);

    res.send(file)
})

app.post('/api/downloadFromFirebase', async (req: any, res: any) => {
    let file: MediaFile = req.body
    if(!file.downloadUrl){
        res.status(400).send({error: 'download Url not working'});
        return;
    }
    let filePath = join(mediaDirPath, file.filename);
    file.status = 'firebase-local';
    if(!existsSync(filePath)) mkdirSync(filePath)
    writeFileSync( join(filePath, 'metadata.json'), JSON.stringify(file))
    
    let fireFile = storage.bucket.file(file.filename);
    fireFile.download({
        destination: join(filePath, file.filename)
    }).then( ()=>{
        res.status(200).send({file})
    }).catch( (error) => {
        console.error({error});
        res.status(400).send({error})
    })
  });

const index = __dirname+'/web/index.html'
app.get('/', (req:any, res: any) => {
    res.sendFile(index);
})
app.get('/home', (req:any, res: any) => {
    res.sendFile(index);
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))

// Jorge Arreola - 2020