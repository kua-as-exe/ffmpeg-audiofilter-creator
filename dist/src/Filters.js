"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = exports.getRandomNumber = exports.inBrackets = void 0;
exports.inBrackets = function (str) { return '[' + str + ']'; };
exports.getRandomNumber = function () { return String(Math.random()).slice(2, 7); }; // from (example) "0.0744077323733392" takes to the 3rd to the 7th character
var Filter = /** @class */ (function () {
    function Filter(FilterOptions) {
        var default_params = FilterOptions.default_params, func = FilterOptions.func, structure = FilterOptions.structure, name = FilterOptions.name, label = FilterOptions.label, description = FilterOptions.description;
        this.def_params = default_params;
        //this.func = func || [];
        this.structure = structure || { inputs: 1, outputs: 1 };
        this.name = name || "";
        this.label = label || "";
        this.description = description || "";
    }
    Filter.prototype.call = function (_params, _inputs, _options) {
        // INPUTS
        //let inputs = _inputs.map( input => inBrackets(input.id)).join(''); // pass all the imputs to a format "[a][b][c]"
        var inputs = _inputs.map(function (input) { return exports.inBrackets(input); }).join(''); // pass all the strings imputs to a format "[a][b][c]"
        // PARAMS        
        var filterParams = [];
        var default_params = {};
        this.def_params.forEach(function (param) { return default_params[param.key] = param.value; }); // prepare the default params
        var params = Object.assign({}, default_params, _params); // merge params and default params
        //Convert the filters in to a ffmpeg syntax
        var filtersKeysList = Object.keys(params); //take the JSON params keys to push to the filterParams array 
        filtersKeysList.forEach(function (key) {
            return filterParams.push(key + '=' + params[key]);
        }); //convert the param to a ffmpeg filter-complex syntax
        // OUTPUTS
        var outputs = [];
        for (var output = 0; output < this.structure.outputs; output++) {
            var outputString = [this.name.toUpperCase(), this.label, exports.getRandomNumber()].join('_');
            outputs.push(outputString);
        }
        if (_options === null || _options === void 0 ? void 0 : _options.final)
            outputs = []; // reset the outputs if its the last filter
        var lineOutputs = outputs.map(function (output) { return exports.inBrackets(output); });
        // FINAL LINE (ffmpeg string)
        var line = [
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
    };
    return Filter;
}());
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
