import { spawnSync } from 'child_process';
import { Filter, Input, Param, audioFilter } from './src/utils'

const ffmpegPath = './src/lib/ffmpeg.exe';

const main = async () => {

    let inputs: Input[] = [
        {
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
    
    const getFilterComplex = () => {
        let af = audioFilter.call(
            inputs,
            {
                'test': 'x',
                'number': 10,
                'data1': 6
            }
        )
        console.log(af)
        return [af].join(';')
    }

    
        
        let ffmpegCommand = [
            ffmpegPath,
            getInputs(inputs),
            '--filter_complex',
            '"',
            getFilterComplex(),
            '"',
        ]
        console.log(ffmpegCommand);
        console.log(ffmpegCommand.join(" "));
        
        //let t = await spawnSync("powershell.exe", [ffmpegPath])
    //console.log(t.stdout.toString())

    //t.output.forEach(t => console.log)
}

main();