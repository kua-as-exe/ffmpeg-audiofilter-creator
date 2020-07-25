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
const index_1 = require("./../index");
const path_1 = require("path");
const child_process_1 = require("child_process");
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
    let data = req.body;
    let serverDir = path_1.join('.\\', 'dist', 'server');
    let fileDir = path_1.join(serverDir, data.fileUrl);
    let waveFormPath = path_1.join(fileDir + ".png");
    let ffmpegCommand = [
        index_1.ffmpegPath,
        '-i',
        fileDir,
        '-filter_complex',
        '"',
        "showwavespic=s=1280x480:split_channels=1",
        '"',
        '-frames:v 1',
        '-y',
        waveFormPath
    ];
    console.log(ffmpegCommand.join(" "));
    console.log(ffmpegCommand);
    let t = yield child_process_1.spawnSync("powershell.exe", ffmpegCommand);
    console.log(t.stdout.toString());
    console.log(t.output.toString());
    console.log(t.stderr.toString());
    res.send({ waveFormUrl: data.fileUrl + '.png' });
}));
app.get('/api/getFilters', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtersData = yield getFilters();
    if (!filtersData)
        res.send({});
    res.send(filtersData);
}));
app.get('/api/getFilter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    let filterName = req.query.filterName;
    let filtersData = yield getFilters();
    let filter = filtersData.filter(filter => filter.name == filterName)[0];
    res.send(filter);
}));
app.get('/', (req, res) => {
    console.log(req);
    res.send({ text: "wtf" });
});
app.listen(SERVER_PORT, () => console.log("Server running"));
