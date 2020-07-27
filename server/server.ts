import { getDataJSON } from "../src/utils";
import { FilterOptions } from "../src/Filter";
import { ClientRequest, ServerResponse } from "http";
import { read, readFileSync, readdirSync, existsSync } from "fs";
import { ffmpegPath } from './../index';
import { join } from "path";
import { spawnSync } from "child_process";

const express = require('express');
const app = express();

const SERVER_PORT = 1234;

app.use('/media', express.static(__dirname + '/media'));
const bodyParser = require('body-parser');
//const session = require('express-session');

//app.use(session({secret: 'idk'}))
app.use(bodyParser.json())

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
})

app.post('/api/processAudio',  async (req: any, res: any) => {
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
    
})

app.get('/api/getFilters',  async (req: any, res: any) => {
    let filtersData = await getFilters();
    if(!filtersData) res.send({})
    res.send(filtersData)
})
app.get('/api/getFilter', async (req: any, res: any) => {
    console.log(req);
    let filterName:string = req.query.filterName
    let filtersData = await getFilters();
    let filter:FilterOptions = filtersData.filter( filter => filter.name == filterName )[0]
    res.send(filter)
})

app.get('/', (req:any, res: any) => {
    console.log(req);
    res.send({text: "wtf"})
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))
