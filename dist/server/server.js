"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
const fs_1 = require("fs");
const path_1 = require("path");
const ffmpeg_1 = require("../src/ffmpeg");
const firebase_1 = require("../src/firebase");
const uuid_1 = require("uuid");
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const SERVER_PORT = 1234;
if (!fs_1.existsSync('./dist/server/media'))
    fs_1.mkdirSync('./dist/server/media'); // crea la carpeta media si no existe (corrección 18/8/20)
app.use('/', express.static(__dirname + '/web'));
app.use('/media', express.static(__dirname + '/media'));
app.use(fileUpload());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const getFilters = () => utils_1.getDataJSON('./dist/data/filters.json');
const mediaDirPath = './dist/server/media';
const waveformFilterComplexLine = `-filter_complex "showwavespic=s=1280x480:draw=full" -frames:v 1 -y`;
app.post('/api/getWaveForm', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let serverDir = path_1.join('.\\', 'dist', 'server');
    let fileDir = path_1.join(serverDir, data.fileUrl);
    let waveFormPath = path_1.join(fileDir + ".png");
    if (fs_1.existsSync(waveFormPath)) {
        res.send({
            waveFormUrl: data.fileUrl + '.png',
            alreadyProcessed: true
        });
    }
    else {
        let ffmpegCommand = [
            ffmpeg_1.ffmpegPath, '-i', fileDir,
            waveformFilterComplexLine,
            waveFormPath
        ];
        console.log(ffmpegCommand.join(" "));
        console.log(ffmpegCommand);
        let process = yield ffmpeg_1.executeFFMPEG(ffmpegCommand);
        res.send({
            waveFormUrl: data.fileUrl + '.png',
            processed: true,
            proccess: process
        });
    }
}));
app.post('/api/processAudio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    let { media, filterChain } = data;
    if (!data || !media || !filterChain) {
        res.status(400).send('Some data is missing, check if all params are connected');
        return;
    }
    else if (!filterChain.filterComplexLine) {
        res.status(400).send('filterComplexLine not preprocessed, do that before bitch');
        return;
    }
    let mediaDir = path_1.join(mediaDirPath, media.filename);
    let inputMediaPath = path_1.join(mediaDir, media.filename);
    let parsedFilename = path_1.parse(media.filename);
    let outputMediaPath = path_1.join(mediaDir, `${parsedFilename.name}.processed${parsedFilename.ext}`);
    console.log("Chain to work: ", filterChain.name, `(${filterChain.id})`);
    console.log("Processing: ", inputMediaPath, " => ", outputMediaPath);
    let ffmpegCommand = [
        ffmpeg_1.ffmpegPath,
        '-i', inputMediaPath,
        `-filter_complex "${filterChain.filterComplexLine}"`,
        '-y',
        outputMediaPath // especificas el archivo de salida
    ];
    console.log(ffmpegCommand.join(" "));
    console.log(ffmpegCommand);
    let process = yield ffmpeg_1.executeFFMPEG(ffmpegCommand);
    if (process.error) {
        console.error("ERROR: ", process.error);
        res.status(400).send({ error: process.error });
        return;
    }
    console.log("Processing ended");
    let output = process.output.filter(out => out != null).map(out => out.toString()).join('\n');
    media.processed = {
        localProcessedUrl: `media/${media.filename}/${parsedFilename.name}.processed${parsedFilename.ext}`,
        output
    };
    // GET THE WAVEFORM
    let outputWaveFormPath = `${outputMediaPath}.png`;
    console.log("Getting Waveform from: ", outputMediaPath, " => ", outputWaveFormPath);
    let wavewformProcess = yield ffmpeg_1.executeFFMPEG([
        ffmpeg_1.ffmpegPath, '-i', outputMediaPath,
        waveformFilterComplexLine,
        outputWaveFormPath
    ]);
    if (!wavewformProcess.error)
        media.processed.localProcessedWaveform = `media/${media.filename}/${parsedFilename.name}.processed${parsedFilename.ext}.png`;
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
}));
app.get('/api/getLocalFiles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let localFiles = fs_1.readdirSync(mediaDirPath);
    let localFilesData = [];
    localFiles.forEach((localFile) => __awaiter(void 0, void 0, void 0, function* () {
        let localFileMetadataPath = path_1.join(mediaDirPath, localFile, 'metadata.json');
        try {
            let metadataData = fs_1.readFileSync(localFileMetadataPath).toString();
            localFilesData.push(JSON.parse(metadataData));
        }
        catch (e) { }
    }));
    res.send({ localFilesData });
}));
app.post('/api/deleteFile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fileToDelete = req.body.fileToDelete;
    if (!fileToDelete) {
        res.status(400).send({ error: 'file not found' });
        return;
    }
    if (fileToDelete.status == 'local' || fileToDelete.status == 'firebase-local') {
        let pathToDelete = path_1.join(mediaDirPath, fileToDelete.filename);
        try {
            let out = fs_1.rmdirSync(pathToDelete, { recursive: true });
            res.send({ 'status': 'deleted' });
        }
        catch (e) {
            res.status(400).send({ message: 'error on delete file, check if have permissions', error: e });
        }
        return;
    }
    else if (fileToDelete.status == 'firebase') {
        firebase_1.storage.bucket.file(fileToDelete.filename).delete().then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield firebase_1.firestore.collection('storageMediaData').doc(fileToDelete.id).delete();
            res.status(200).send({ 'status': 'deleted' });
        })).catch((reason) => {
            console.log("Error on delete bucket object: ", reason);
            res.status(400).send({ error: reason });
        });
        return;
    }
    res.status(400).send({ 'status': 'file not found' });
}));
app.post('/api/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send('No files were uploaded.');
    let reqFile = req.files.file;
    // adapt request file to program type MediaFile to be returned
    let file = {
        mimetype: reqFile.mimetype,
        filename: reqFile.name,
        size: reqFile.size,
        uploadedTime: new Date(),
        id: utils_1.getRandomId(),
        processed: {}
    };
    console.log(file);
    let filePath = path_1.join(mediaDirPath, file.filename);
    if (!fs_1.existsSync(filePath))
        fs_1.mkdirSync(filePath);
    fs_1.writeFileSync(path_1.join(filePath, 'metadata.json'), JSON.stringify(file));
    // Use the mv() method to place the file somewhere on your server
    reqFile.mv(path_1.join(filePath, file.filename), function (err) {
        if (err)
            return res.status(500).send(err);
        res.send(file);
    });
});
app.post('/api/uploadToFirebase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let file = req.body;
    if (!file) {
        res.status(400).send({ error: 'No file was uploaded.' });
        return;
    }
    delete file.processed;
    let filePath = path_1.join(mediaDirPath, file.filename, file.filename);
    let tokenUuid = uuid_1.v1();
    let uploadResult = yield firebase_1.storage.bucket.upload(filePath, {
        contentType: "media",
        metadata: {
            contentType: file.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: tokenUuid
            }
        }
    });
    let resultFile = uploadResult[0];
    console.log(resultFile);
    let downloadUrl = "https://firebasestorage.googleapis.com/v0/b/" + firebase_1.storage.bucket.name + "/o/" + encodeURIComponent(resultFile.name) + "?alt=media&token=" + tokenUuid;
    file.downloadToken = tokenUuid;
    file.downloadUrl = downloadUrl;
    file.uploadedTime = new Date();
    file.status = 'firebase-local';
    let fileMetadataPath = path_1.join(mediaDirPath, file.filename, 'metadata.json');
    fs_1.writeFileSync(fileMetadataPath, JSON.stringify(file));
    console.log(file);
    res.send(file);
}));
app.post('/api/downloadFromFirebase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let file = req.body;
    if (!file.downloadUrl) {
        res.status(400).send({ error: 'download Url not working' });
        return;
    }
    let filePath = path_1.join(mediaDirPath, file.filename);
    file.status = 'firebase-local';
    if (!fs_1.existsSync(filePath))
        fs_1.mkdirSync(filePath);
    fs_1.writeFileSync(path_1.join(filePath, 'metadata.json'), JSON.stringify(file));
    let fireFile = firebase_1.storage.bucket.file(file.filename);
    fireFile.download({
        destination: path_1.join(filePath, file.filename)
    }).then(() => {
        res.status(200).send({ file });
    }).catch((error) => {
        console.error({ error });
        res.status(400).send({ error });
    });
}));
const index = __dirname + '/web/index.html';
app.get('/', (req, res) => {
    res.sendFile(index);
});
app.get('/home', (req, res) => {
    res.sendFile(index);
});
app.listen(SERVER_PORT, () => console.log("Server running"));
// Jorge Arreola - 2020
