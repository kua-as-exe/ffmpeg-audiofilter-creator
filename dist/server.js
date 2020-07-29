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
const express = require('express');
const app = express();
const SERVER_PORT = 1234;
app.use('/media', express.static(__dirname + '/media'));
const bodyParser = require('body-parser');
//const session = require('express-session');
//app.use(session({secret: 'idk'}))
app.use(bodyParser.json());
const getFilters = () => utils_1.getDataJSON('./dist/data/filters.json');
app.post('/api/getWaveForm', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
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
            ffmpegPath,
            '-i',
            fileDir,
            '-filter_complex',
            '"',
            "showwavespic=s=1280x480:split_channels=1:draw=full",
            '"',
            '-frames:v 1',
            '-y',
            waveFormPath
        ]
        console.log(ffmpegCommand.join(" "));
        console.log(ffmpegCommand);
        
        let t = await spawnSync("powershell.exe", ffmpegCommand);
        console.log(t.stdout.toString());
        console.log(t.output.toString());
        console.log(t.stderr.toString());

    res.send(
            {
                waveFormUrl: data.fileUrl+'.png',
                processed: true
            }
        );
    }
    */
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
app.get('/', (req, res) => {
    console.log(req);
    res.send("En proceso todavía c:");
});
app.listen(SERVER_PORT, () => console.log("Server running"));
