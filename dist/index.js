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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Filter_1 = require("./src/Filter");
var fs_1 = require("fs");
var path_1 = require("path");
var utils_1 = require("./src/utils");
var ffmpegPath = './src/lib/ffmpeg.exe';
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var input_files, inputs, processFilters, processParams, getInputs, filtersData, filters, searchFilter, effectsChain, getFilterComplex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input_files = fs_1.readdirSync('./media/to_process');
                inputs = [];
                input_files.forEach(function (file, index) {
                    inputs.push({
                        id: index,
                        path: path_1.join('./media/to_process', file),
                        params: {
                            before: [],
                            after: []
                        }
                    });
                });
                processFilters = function (filter, index, arrayFilters) { return [filter.key, filter.value].join(" "); };
                processParams = function (params) { return params.map(processFilters).join(" ") || ""; };
                getInputs = function (inputs) {
                    var lines = [];
                    inputs.forEach(function (input) {
                        var _a, _b;
                        input.line = [
                            processParams((_a = input.params) === null || _a === void 0 ? void 0 : _a.before),
                            '-i',
                            "'" + input.path + "'",
                            processParams((_b = input.params) === null || _b === void 0 ? void 0 : _b.after),
                        ].join(" ");
                        lines.push(input.line);
                    });
                    return lines.join(" ");
                };
                return [4 /*yield*/, utils_1.getDataJSON('./dist/data/filters.json')];
            case 1:
                filtersData = _a.sent();
                filters = filtersData.map(function (filter) { return new Filter_1.Filter(filter); });
                searchFilter = function (filterName) { return filters.filter(function (filter) { return filter.name == filterName; })[0]; };
                return [4 /*yield*/, utils_1.getDataJSON('./dist/data/configuration.json')];
            case 2:
                effectsChain = _a.sent();
                console.log(effectsChain);
                getFilterComplex = function () {
                    var keys = Object.keys(effectsChain);
                    var last_outputs = [];
                    var effects_lines = [];
                    keys.forEach(function (effect, index, array) {
                        var filter = searchFilter(effect);
                        if (!filter)
                            return; // break if filter doesnt exists
                        var options = {};
                        if (index == array.length - 1)
                            options['final'] = true; // add final option if last
                        var params = effectsChain[effect]; // take the params
                        var out = filter.call(params, last_outputs, options); // call the filter
                        effects_lines.push(out.line); // save the line
                        last_outputs = out.outputs; // save the output
                    });
                    //console.log(effects_lines)
                    return effects_lines.join(';');
                };
                //console.log(getFilterComplex());
                return [4 /*yield*/, inputs.forEach(function (input, index) { return __awaiter(void 0, void 0, void 0, function () {
                        var filename, ffmpegCommand, t;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    filename = input_files[index];
                                    ffmpegCommand = [
                                        ffmpegPath,
                                        getInputs(inputs),
                                        '-filter_complex',
                                        '"',
                                        getFilterComplex(),
                                        '"',
                                        '-y',
                                        path_1.join("'./media/processed", filename + "'")
                                    ];
                                    console.log(ffmpegCommand.join(" "));
                                    console.log(ffmpegCommand);
                                    return [4 /*yield*/, child_process_1.spawnSync("powershell.exe", ffmpegCommand)];
                                case 1:
                                    t = _a.sent();
                                    console.log(t.stdout.toString());
                                    console.log(t.output.toString());
                                    console.log(t.stderr.toString());
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                //console.log(getFilterComplex());
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main();
