import { spawnSync } from 'child_process';
import { Filter, Input, Param, FilterOptions } from './src/Filter'
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getDataJSON } from './src/utils';
import { executeFFMPEG } from './src/ffmpeg';

export const ffmpegPath = './src/lib/ffmpeg.exe';

const main = async () => {

    //let input_files = readdirSync('./media/to_process')
    let inputs: Input[] = [];
    
    inputs.push({
        path: join('./media/to_process', file),
        params: {
            before: [],
            after: []
        }
    })


    const processFilters = (filter: any, index:number, arrayFilters: any[]) => [filter.key, filter.value].join(" ");
    const processParams = (params: Param[] | any) => params.map(processFilters).join(" ") || "";

    const getInputIine = (input: Input) => [
        processParams(input.params?.before),
        '-i',
        "'"+input.path+"'",
        processParams(input.params?.after),
    ].join(" ")

    const getInputs = (inputs: Input[]) => inputs.map( (input: Input) => getInputIine ).join(' ')
    
    /* GET THE FILTERS DATA */
    const filtersData: FilterOptions[] = await getDataJSON('./dist/data/filters.json')
    
    const filters = filtersData.map( (filter) => new Filter(filter))
    const searchFilter = ( filterName:string ): Filter => filters.filter( filter => filter.name == filterName)[0];

    /* GET CHAIN DATA */
    const effectsChain: any = await getDataJSON('./dist/data/configuration.json')

    //console.log(getFilterComplex());
    
    await inputs.forEach( async (input, index) => {

        //  let filename = input_files[index];

        let ffmpegCommand: string[] = [
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
        
        let process = await executeFFMPEG(ffmpegCommand);
    })
    
}

main();