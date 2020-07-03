
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
    metadata: {
        name: string,
        label: string
    };
    default_values: Param[];
    func: Function[];
    structure: {
        inputs: number;
        outputs: number;
    }
}

export const inBrackets = (str: string | number) => '['+str+']';
export const getRandomNumber = () => String(Math.random()).slice(2,7); // from (example) "0.0744077323733392" takes to the 3rd to the 7th character

export class Filter{
    inputs: Input[] = [];
    def_params: Param[];
    params: Param[] = [];
    func: Function[];
    structure: {
        inputs: number;
        outputs: number;
    }
    output: string = '';
    metadata: {
        name: string;
        label:string;
    };
    line = '';

    constructor( FilterOptions: FilterOptions){
        let {default_values, func, structure, metadata} = FilterOptions;
        this.def_params = default_values;
        this.func = func;
        this.structure = structure;
        this.metadata = metadata
    }

    private resolveFunction = () => {
        let inputs
        if (this.inputs.length == 0) {
            inputs = [];
        }
        else {
            inputs = this.inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
        }

        let filterParams:string[] = [];
        Object.keys(this.params).forEach( (key:any) => { //take the JSON params keys to push to the filterParams array 
            let param = key+'='+this.params[key]; //convert the param to a ffmpeg filter-complex syntax
            filterParams.push(param);
        })

        let outString = [
            this.metadata.name.toUpperCase(),
            this.metadata.label,
            this.output,
            getRandomNumber()
        ].join('_')
        //this.output = inBrackets(outString);
        this.output = "";

        let line = [
            inputs,
            this.metadata.label,
            '=',
            filterParams.join(':'), //concat all the params with the ffmpeg filter-complex syntax
            this.output
        ].join('');

        this.line = line;
    }

    call(inputs: Input[], params: Object){
        this.inputs = inputs;
        let default_params: any = {};
        this.def_params.forEach( param => default_params[param.key] = param.value); // prepare the default params

        this.params = Object.assign({}, default_params, params); // merge params and default params
        
        this.func.forEach( 
             (f) => f(this.params, this, this.resolveFunction));

        console.log("AKI HAY OTRA COSA", this.line)
        return this.line
    }
}

export const audioFilter = new Filter(
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


