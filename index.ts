import { spawnSync } from 'child_process';
import { Filter, Input, Param, FilterOptions } from './src/utils'
import { readFileSync } from 'fs';

const ffmpegPath = './src/lib/ffmpeg.exe';

const main = async () => {

    let inputs: Input[] = [
        /*{
            id: 0,
            path: './video.mp4',
            params: {
                before: [
                    { key: '--to', value: 5}
                ],
                after: [
                    { key: '-t', value: 10 }
                ]
            }
        },{
            id: 1,
            path: './video2.mp4',
            params: {
                before: [
                    { key: '--to', value: 6}
                ],
                after: [
                    { key: '-t', value: 2 }
                ]
            }
        }*/
        {
            id: 0,
            path: 'C:\\Users\\Jorge Arreola\\Music\\Videoder\\RUMINE.mp3',
            params: {
                before: [],
                after: [
                    { key: '-t', value: '1:00' }
                ]
            }
        }
    ]
    let complex = {

    }


    const processFilters = (filter: any, index:number, arrayFilters: any[]) => [filter.key, filter.value].join(" ");
    const processParams = (params: Param[] | any) => params.map(processFilters).join(" ") || "";

    const getInputs = (inputs: Input[]) => {
        let lines:string[] = [];
        inputs.forEach( (input: Input) => {
            input.line = [
                processParams(input.params?.before),
                '-i',
                "'"+input.path+"'",
                processParams(input.params?.after),
            ].join(" ");
            lines.push(input.line);
        })
        return lines.join(" ");
    }
    
    
    const filtersData: FilterOptions[] = 
        JSON.parse(
            await readFileSync('./dist/data/filters.json')
                .toString())
    
    const filters = filtersData.map( (filter) => new Filter(filter))
    //console.log(filters);

    const searchFilter = ( filterName:string ): Filter => filters.filter( filter => filter.name == filterName)[0];
    //filtersData.forEach()
            
    //console.log(searchFilter("volume"))
    //console.log(searchFilter("volume2"))
    let volume: Filter = searchFilter("volume");
    let out;
    if(volume) out = volume.call(
        {
            "param1":"xd",
            "param2":"xd2",
        },
        ["a", "b"],
        //{"final": true}
    )

    console.log(out);


    const getFilterComplex = () => {

        /*let af = audioFilter.call(
            inputs,
            {
                'test': 'x',
                'number': 4,
                'data1': 17
            }
        )*/
        
        return [
            /*acompressor.call(
                inputs, 
                {
                    threshold: 0.5,
                    ratio: 20,
                    attack: 0.01,
                    release: 0.01,
                    makeup: 1.25,
            }),
            flanger.call([], {
                delay:10,
                regen:50,
                width:100,
                speed:2
            }),
            volume.call([], {
                volume: 2
            }),
            acompressor.call(
                [], 
                {
                    threshold: 0.5,
                    ratio: 20,
                    attack: 0.01,
                    release: 0.01,
                    makeup: 1.25,
            }),*/
        //].join(';')
        ].join(';')
    }

    
        
        let ffmpegCommand = [
            ffmpegPath,
            getInputs(inputs),
            '-filter_complex',
            '"',
            getFilterComplex(),
            '"',
            '-y',
            "'C:\\Users\\Jorge Arreola\\Music\\Videoder\\RUMINE_REMASTERED_3.mp3'"
        ]
        //console.log(ffmpegCommand);
        //console.log(ffmpegCommand.join(" "));
        
        //let t = await spawnSync("powershell.exe", ffmpegCommand);
        //console.log(t.stdout.toString());
        //console.log(t.output.toString());
        //console.log(t.stderr.toString());
}

main();