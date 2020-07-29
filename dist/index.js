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
exports.ffmpegPath = void 0;
const Filter_1 = require("./src/Filter");
const path_1 = require("path");
const utils_1 = require("./src/utils");
const ffmpeg_1 = require("./src/ffmpeg");
exports.ffmpegPath = './src/lib/ffmpeg.exe';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    //let input_files = readdirSync('./media/to_process')
    let inputs = [];
    inputs.push({
        path: path_1.join('./media/to_process', file),
        params: {
            before: [],
            after: []
        }
    });
    const processFilters = (filter, index, arrayFilters) => [filter.key, filter.value].join(" ");
    const processParams = (params) => params.map(processFilters).join(" ") || "";
    const getInputIine = (input) => {
        var _a, _b;
        return [
            processParams((_a = input.params) === null || _a === void 0 ? void 0 : _a.before),
            '-i',
            "'" + input.path + "'",
            processParams((_b = input.params) === null || _b === void 0 ? void 0 : _b.after),
        ].join(" ");
    };
    const getInputs = (inputs) => inputs.map((input) => getInputIine).join(' ');
    /* GET THE FILTERS DATA */
    const filtersData = yield utils_1.getDataJSON('./dist/data/filters.json');
    const filters = filtersData.map((filter) => new Filter_1.Filter(filter));
    const searchFilter = (filterName) => filters.filter(filter => filter.name == filterName)[0];
    /* GET CHAIN DATA */
    const effectsChain = yield utils_1.getDataJSON('./dist/data/configuration.json');
    //console.log(getFilterComplex());
    yield inputs.forEach((input, index) => __awaiter(void 0, void 0, void 0, function* () {
        //  let filename = input_files[index];
        let ffmpegCommand = [
            exports.ffmpegPath,
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
        let process = yield ffmpeg_1.executeFFMPEG(ffmpegCommand);
    }));
});
main();
