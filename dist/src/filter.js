"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterLine = exports.getRandomNumber = exports.inBrackets = void 0;
exports.inBrackets = (str) => '[' + str + ']';
exports.getRandomNumber = () => String(Math.random()).slice(2, 7); // from (example) "0.0744077323733392" takes to the 3rd to the 7th character
exports.getFilterLine = 
//  ( _params: Object, _inputs: string[], _options?: any): {line: string, outputs: string[]} 
(_inputs, _outputs, chainFilter, filter) => {
    // INPUTS
    //let inputs = _inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
    let inputs = _inputs.map(input => exports.inBrackets(input)).join(''); // pass all the strings imputs to a format "[a][b][c]"
    // PARAMS        
    let filterParams = [];
    let default_params = {};
    filter.default_params.forEach(param => default_params[param.key] = param.value); // prepare the default params
    let params = Object.assign({}, default_params, chainFilter.params); // merge params and default params (Last overrides first)
    //Convert the filters in to a ffmpeg syntax
    let filtersKeysList = Object.keys(params); //take the JSON params keys to push to the filterParams array 
    filtersKeysList.forEach((key) => filterParams.push(key + '=' + params[key])); //convert the param to a ffmpeg filter-complex syntax
    // OUTPUTS
    let outputs = [];
    for (var output = 1; output < _outputs; output++) {
        let outputString = [filter.name.toUpperCase(), filter.label, exports.getRandomNumber()].join('_');
        outputs.push(outputString);
    }
    //if(_options?.final) outputs = []; // reset the outputs if its the last filter
    let lineOutputs = outputs.map(output => exports.inBrackets(output));
    // FINAL LINE (ffmpeg string)
    let line = [
        inputs,
        filter.label,
        '=',
        filterParams.join(':'),
        lineOutputs.join('')
    ].join('');
    //this.func.forEach( (f) => f(this.params, this, this.resolveFunction));
    return {
        line: line,
        outputs: outputs
    };
};
