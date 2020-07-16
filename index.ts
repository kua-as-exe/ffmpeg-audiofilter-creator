import { spawnSync } from 'child_process';
import { Filter, Input, Param, FilterOptions } from './src/Filter'
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getDataJSON } from './src/utils';

const ffmpegPath = './src/lib/ffmpeg.exe';

const main = async () => {

    let input_files = readdirSync('./media/to_process')
    let inputs: Input[] = [];
    
    input_files.forEach( (file, index) => {
        inputs.push({
            id: index,
            path: join('./media/to_process', file),
            params: {
                before: [],
                after: []
            }
        }
            
        )
    })


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
    
    
    const filtersData: FilterOptions[] = await getDataJSON('./dist/data/filters.json')
    
    const filters = filtersData.map( (filter) => new Filter(filter))
    const searchFilter = ( filterName:string ): Filter => filters.filter( filter => filter.name == filterName)[0];
    //filtersData.forEach()


    const effectsChain: any = await getDataJSON('./dist/data/configuration.json')
    console.log(effectsChain)

    const getFilterComplex = () => {

        let keys = Object.keys(effectsChain);

        let last_outputs: string[] = [];
        let effects_lines: string[] = []

        keys.forEach( (effect, index, array) => {
            let filter:Filter = searchFilter(effect);
            if(!filter) return; // break if filter doesnt exists

            let options: any = {}
            if(index == array.length-1) options['final'] = true; // add final option if last

            let params: object = effectsChain[effect] // take the params
            let out = filter.call(params, last_outputs, options); // call the filter
            effects_lines.push(out.line) // save the line
            last_outputs = out.outputs; // save the output
        })

        //console.log(effects_lines)

        return effects_lines.join(';')
    }

    //console.log(getFilterComplex());
    
    await inputs.forEach( async (input, index) => {

        let filename = input_files[index];

        let ffmpegCommand = [
            ffmpegPath,
            getInputs(inputs),
            '-filter_complex',
            '"',
            getFilterComplex(),
            '"',
            '-y',
            join("'./media/processed", filename+"'")
        ]
        console.log(ffmpegCommand.join(" "));
        console.log(ffmpegCommand);
        
        let t = await spawnSync("powershell.exe", ffmpegCommand);
        console.log(t.stdout.toString());
        console.log(t.output.toString());
        console.log(t.stderr.toString());
    })
    
}

main();