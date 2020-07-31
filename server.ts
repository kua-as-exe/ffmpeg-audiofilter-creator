import { getDataJSON } from "./src/utils";
import { FilterOptions } from "./src/Filter";
import { MediaFile } from "./src/storage";
import { ClientRequest, ServerResponse } from "http";
import { read, readFileSync, readdirSync, existsSync, fstat, mkdirSync, writeFileSync, rmdirSync } from "fs";
import { join, parse, ParsedPath } from "path";
import { spawnSync } from "child_process";
import { executeFFMPEG, ffmpegPath } from "./src/ffmpeg";


const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();

const SERVER_PORT = 1234;

app.use('/media', express.static(__dirname + '/server/media'));
app.use(fileUpload());
const bodyParser = require('body-parser');
app.use(bodyParser.json())
//const session = require('express-session');

//app.use(session({secret: 'idk'}))

const getFilters = (): Promise<FilterOptions[]> => getDataJSON('./dist/data/filters.json');

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
            '-filter_complex "showwavespic=s=1280x480:draw=full" -frames:v 1 -y',
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

const mediaDirPath = './dist/server/media';

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
    let pathToDelete = join(mediaDirPath, fileToDelete.path.base)
    console.log(pathToDelete);
    try{
        let out = rmdirSync(pathToDelete, { recursive: true });
        res.status(200).send({'status': 'deleted'})
    }catch(e){}
    
})

app.post('/api/upload', function(req: any, res: any) {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send('No files were uploaded.');
    
    let reqFile = req.files.file;
  

    // adapt request file to program type MediaFile to be returned
    let nameParsed: ParsedPath = parse(reqFile.name)
    let file: MediaFile = {
        mimetype: reqFile.mimetype, 
        path: {
            name: nameParsed.name,
            base: nameParsed.base,
            dir: nameParsed.dir,
            ext: nameParsed.ext
        },
        size: reqFile.size,
        uploadedTime: new Date()
    }
    console.log(file);
  
    let filePath = join(mediaDirPath, file.path.base);

    if(!existsSync(filePath)) mkdirSync(filePath)
    writeFileSync( join(filePath, 'metadata.json'), JSON.stringify(file))

    // Use the mv() method to place the file somewhere on your server
    reqFile.mv( join(filePath, file.path.base) , function(err: any) {
      if (err) return res.status(500).send(err);
      res.send(file);
    });
  });

app.get('/', (req:any, res: any) => {
    console.log(req);
    res.send("En proceso todavía c:")
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))
