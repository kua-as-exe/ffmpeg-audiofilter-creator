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
const utils_1 = require("./src/utils");
const fs_1 = require("fs");
const path_1 = require("path");
const ffmpeg_1 = require("./src/ffmpeg");
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const SERVER_PORT = 1234;
app.use('/media', express.static(__dirname + '/server/media'));
app.use(fileUpload());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//const session = require('express-session');
//app.use(session({secret: 'idk'}))
const getFilters = () => utils_1.getDataJSON('./dist/data/filters.json');
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
            '-filter_complex "showwavespic=s=1280x480:draw=full" -frames:v 1 -y',
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
const mediaDirPath = './dist/server/media';
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
    let pathToDelete = path_1.join(mediaDirPath, fileToDelete.path.base);
    console.log(pathToDelete);
    try {
        let out = fs_1.rmdirSync(pathToDelete, { recursive: true });
        res.status(200).send({ 'status': 'deleted' });
    }
    catch (e) { }
}));
app.post('/api/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send('No files were uploaded.');
    let reqFile = req.files.file;
    // adapt request file to program type MediaFile to be returned
    let nameParsed = path_1.parse(reqFile.name);
    let file = {
        mimetype: reqFile.mimetype,
        path: {
            name: nameParsed.name,
            base: nameParsed.base,
            dir: nameParsed.dir,
            ext: nameParsed.ext
        },
        size: reqFile.size,
        uploadedTime: new Date()
    };
    console.log(file);
    let filePath = path_1.join(mediaDirPath, file.path.base);
    if (!fs_1.existsSync(filePath))
        fs_1.mkdirSync(filePath);
    fs_1.writeFileSync(path_1.join(filePath, 'metadata.json'), JSON.stringify(file));
    // Use the mv() method to place the file somewhere on your server
    reqFile.mv(path_1.join(filePath, file.path.base), function (err) {
        if (err)
            return res.status(500).send(err);
        res.send(file);
    });
});
app.get('/', (req, res) => {
    console.log(req);
    res.send("En proceso todavía c:");
});
app.listen(SERVER_PORT, () => console.log("Server running"));
