"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioFilter = exports.Filter = exports.getRandomNumber = exports.inBrackets = void 0;
exports.inBrackets = function (str) { return '[' + str + ']'; };
exports.getRandomNumber = function () { return String(Math.random()).slice(2, 7); }; // from (example) "0.0744077323733392" takes to the 3rd to the 7th character
var Filter = /** @class */ (function () {
    function Filter(FilterOptions) {
        var _this = this;
        this.inputs = [];
        this.params = [];
        this.output = '';
        this.line = '';
        this.resolveFunction = function () {
            var inputs = _this.inputs.map(function (input) { return exports.inBrackets(input.id); }).join(''); // pass all the imputs to a format "[a][b][c]"
            var filterParams = [];
            Object.keys(_this.params).forEach(function (key) {
                var param = key + '=' + _this.params[key]; //convert the param to a ffmpeg filter-complex syntax
                filterParams.push(param);
            });
            var outString = [
                _this.metadata.name.toUpperCase(),
                _this.metadata.label,
                _this.output,
                exports.getRandomNumber()
            ].join('_');
            _this.output = exports.inBrackets(outString);
            var line = [
                inputs,
                _this.metadata.label,
                '=',
                filterParams.join(':'),
                _this.output
            ].join('');
            _this.line = line;
        };
        var default_values = FilterOptions.default_values, func = FilterOptions.func, structure = FilterOptions.structure, metadata = FilterOptions.metadata;
        this.def_params = default_values;
        this.func = func;
        this.structure = structure;
        this.metadata = metadata;
    }
    Filter.prototype.call = function (inputs, params) {
        var _this = this;
        this.inputs = inputs;
        var default_params = {};
        this.def_params.forEach(function (param) { return default_params[param.key] = param.value; }); // prepare the default params
        this.params = Object.assign({}, default_params, params); // merge params and default params
        this.func.forEach(function (f) { return f(_this.params, _this, _this.resolveFunction); });
        return this.line;
    };
    return Filter;
}());
exports.Filter = Filter;
exports.audioFilter = new Filter({
    metadata: {
        name: 'audio-filter',
        label: 'aFilter'
    },
    default_values: [
        { key: 'data1', value: 5, definition: { min: 1, max: 10 } }
    ],
    func: [
        function (params, filter, resolve) {
            console.log(1, params);
        }, function (params, filter, resolve) {
            console.log(2, params);
            filter.output = params.number + 1 || 'NULL';
            resolve();
        }
    ],
    structure: {
        inputs: 1,
        outputs: 1
    }
});
