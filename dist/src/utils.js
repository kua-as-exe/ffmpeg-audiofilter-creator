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
exports.Filter = exports.getRandomNumber = exports.inBrackets = exports.getDataJSON = void 0;
const fs_1 = require("fs");
exports.getDataJSON = (path) => __awaiter(void 0, void 0, void 0, function* () {
    return JSON.parse(yield fs_1.readFileSync(path)
        .toString());
});
exports.inBrackets = (str) => '[' + str + ']';
exports.getRandomNumber = () => String(Math.random()).slice(2, 7); // from (example) "0.0744077323733392" takes to the 3rd to the 7th character: 07440
class Filter {
    constructor(FilterOptions) {
        let { default_params, func, structure, name, label, description } = FilterOptions;
        this.def_params = default_params;
        //this.func = func || [];
        this.structure = structure || { inputs: 1, outputs: 1 };
        this.name = name || "";
        this.label = label || "";
        this.description = description || "";
    }
    call(_params, _inputs, _options) {
        // INPUTS
        //let inputs = _inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
        let inputs = _inputs.map(input => exports.inBrackets(input)).join(''); // pass all the strings imputs to a format "[a][b][c]"
        // PARAMS        
        let filterParams = [];
        let default_params = {};
        this.def_params.forEach(param => default_params[param.key] = param.value); // prepare the default params
        let params = Object.assign({}, default_params, _params); // merge params and default params
        //Convert the filters in to a ffmpeg syntax
        let filtersKeysList = Object.keys(params); //take the JSON params keys to push to the filterParams array 
        filtersKeysList.forEach((key) => filterParams.push(key + '=' + params[key])); //convert the param to a ffmpeg filter-complex syntax
        // OUTPUTS
        let outputs = [];
        for (var output = 0; output < this.structure.outputs; output++) {
            let outputString = [this.name.toUpperCase(), this.label, exports.getRandomNumber()].join('_');
            outputs.push(outputString);
        }
        if (_options === null || _options === void 0 ? void 0 : _options.final)
            outputs = []; // reset the outputs if its the last filter
        let lineOutputs = outputs.map(output => exports.inBrackets(output));
        // FINAL LINE (ffmpeg string)
        let line = [
            inputs,
            this.label,
            '=',
            filterParams.join(':'),
            lineOutputs.join('')
        ].join('');
        //this.func.forEach( (f) => f(this.params, this, this.resolveFunction));
        return {
            line: line,
            outputs: outputs
        };
    }
}
exports.Filter = Filter;
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
