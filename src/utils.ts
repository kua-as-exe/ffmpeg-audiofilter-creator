import { readFileSync } from "fs";


export const getDataJSON = async (path: string) => JSON.parse(
     await readFileSync(path)
        .toString())
export interface Param{
    key: string;
    value: string | number;
    definition?: {
        min?: number;
        max?: number;
        options?: string[];
        editable?: boolean;
    };
    metadata?: {
        
    }
}
export interface Input{
    id: number;
    path: string;
    params?: {
        after?: Param[];
        before?: Param[];
    };
    line?: string;
}
export interface FilterOptions { 
    name: string,
    label: string,
    description?: string;
    default_params: Param[];
    func: Function[];
    structure: {
        inputs: number;
        outputs: number;
    }
}

export const inBrackets = (str: string | number) => '['+str+']';
export const getRandomNumber = () => String(Math.random()).slice(2,7); // from (example) "0.0744077323733392" takes to the 3rd to the 7th character: 07440

export class Filter{
    //inputs: Input[] = [];
    //outputs: string[] = [];
    def_params: Param[];
    //params: Param[] = [];
    //func: Function[];
    name: string;
    label: string;
    description: string;
    //line = '';
    structure: {
        inputs: number;
        outputs: number;
    }
    
    constructor( FilterOptions: FilterOptions){
        let {default_params, func, structure, name, label, description} = FilterOptions;
        this.def_params = default_params;
        //this.func = func || [];
        this.structure = structure || { inputs: 1, outputs:1 };
        this.name = name || "";
        this.label = label || "";
        this.description = description || "";
    }

    call( _params: Object, _inputs: string[], _options?: any): {line: string, outputs: string[]} {

// INPUTS
        //let inputs = _inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
        let inputs = _inputs.map( input => inBrackets(input) ).join(''); // pass all the strings imputs to a format "[a][b][c]"
        
// PARAMS        
        let filterParams:string[] = [];

        let default_params: any = {};
        this.def_params.forEach( param => default_params[param.key] = param.value); // prepare the default params
        let params:any = Object.assign({}, default_params, _params); // merge params and default params
    
        //Convert the filters in to a ffmpeg syntax
        let filtersKeysList = Object.keys(params); //take the JSON params keys to push to the filterParams array 
        filtersKeysList.forEach( (key:any) =>  
            filterParams.push(key+'='+params[key])) //convert the param to a ffmpeg filter-complex syntax

// OUTPUTS
        let outputs = [];
        for(var output = 0; output < this.structure.outputs; output++){
            let outputString = [ this.name.toUpperCase(), this.label, getRandomNumber() ].join('_');
            outputs.push(outputString);
        }
        if(_options?.final) outputs = []; // reset the outputs if its the last filter
        let lineOutputs = outputs.map( output => inBrackets(output) )

// FINAL LINE (ffmpeg string)
        let line = [
            inputs,
            this.label,
            '=',
            filterParams.join(':'), //concat all the params with the ffmpeg filter-complex syntax
            lineOutputs.join('')
        ].join('');
       
        //this.func.forEach( (f) => f(this.params, this, this.resolveFunction));
        return {
            line: line,
            outputs: outputs
        }
    }
}

/*export const audioFilter = new Filter(
    {
        metadata: {
            name:'audio-filter',
            label:'aFilter'
        },
        default_values: [
            { key: 'data1', value: 5, definition: {min:1, max: 10} }
        ],
        func: [ 
            (params: any, filter: Filter, resolve: Function) => {
                console.log(1, params);

            },(params: any, filter: Filter, resolve: Function) => {
                console.log(2, params);
                filter.output = params.numero;
                resolve()
            }
        ],
        structure: {
            inputs: 1,
            outputs: 1
        }
    }

);

*/


import {randomBytes} from 'crypto';

export function getRandomId(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  while (autoId.length < 20) {
    const bytes = randomBytes(40);
    bytes.forEach(b => {
      // Length of `chars` is 62. We only take bytes between 0 and 62*4-1
      // (both inclusive). The value is then evenly mapped to indices of `char`
      // via a modulo operation.
      const maxValue = 62 * 4 - 1;
      if (autoId.length < 20 && b <= maxValue) {
        autoId += chars.charAt(b % 62);
      }
    });
  }
  return autoId;
}