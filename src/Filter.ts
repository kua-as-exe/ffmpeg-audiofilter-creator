import { FiltersChain, FilterParams } from "./FilterChain";

export interface Param{
    key: string;
    value: string | number;
    definition?: {
        type: "range" | "options";
        range?: {
            min: number;
            max: number;
        }
        options?: string[];
    };
    editable?: boolean;
    metadata?: {
        
    }
}

export interface Media{
    path: string;
    params?: {
        after?: Param[];
        before?: Param[];
    };
    line?: string;
}

export type Input = Media

export type Output = Media

export interface FilterOptions {
    id: string
    name: string,
    label: string,
    description?: string;
    default_params: Param[];
    func?: Function[];
    structure?: {
        inputs?: number;
        outputs?: number;
    }
}

export const inBrackets = (str: string | number) => '['+str+']';
export const getRandomNumber = () => String(Math.random()).slice(2,7); // from (example) "0.0744077323733392" takes to the 3rd to the 7th character

export const getFilterLine = 
//  ( _params: Object, _inputs: string[], _options?: any): {line: string, outputs: string[]} 
    ( _inputs: string[], _outputs: number, chainFilter: FilterParams, filter: FilterOptions): {line: string, outputs: string[]} => {

// INPUTS
        //let inputs = _inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
        let inputs = _inputs.map( input => inBrackets(input) ).join(''); // pass all the strings imputs to a format "[a][b][c]"
        
// PARAMS        
        let filterParams:string[] = [];

        let default_params: any = {};
        filter.default_params.forEach( param => default_params[param.key] = param.value); // prepare the default params

        let params:any = Object.assign({}, default_params, chainFilter.params); // merge params and default params (Last overrides first)
    
        //Convert the filters in to a ffmpeg syntax
        let filtersKeysList = Object.keys(params); //take the JSON params keys to push to the filterParams array 
        filtersKeysList.forEach( (key:any) =>  
            filterParams.push(key+'='+params[key])) //convert the param to a ffmpeg filter-complex syntax

// OUTPUTS
        let outputs = [];
        for(var output = 1; output < _outputs; output++){
            let outputString = [ filter.name.toUpperCase(), filter.label, getRandomNumber() ].join('_');
            outputs.push(outputString);
        }
        //if(_options?.final) outputs = []; // reset the outputs if its the last filter
        let lineOutputs = outputs.map( output => inBrackets(output) )

// FINAL LINE (ffmpeg string)
        let line = [
            inputs,
            filter.label,
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