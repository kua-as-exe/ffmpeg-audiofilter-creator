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
const child_process_1 = require("child_process");
const Filter_1 = require("./src/Filter");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./src/utils");
const ffmpegPath = './src/lib/ffmpeg.exe';
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let input_files = fs_1.readdirSync('./media/to_process');
    let inputs = [];
    input_files.forEach((file, index) => {
        inputs.push({
            id: index,
            path: path_1.join('./media/to_process', file),
            params: {
                before: [],
                after: []
            }
        });
    });
    const processFilters = (filter, index, arrayFilters) => [filter.key, filter.value].join(" ");
    const processParams = (params) => params.map(processFilters).join(" ") || "";
    const getInputs = (inputs) => {
        let lines = [];
        inputs.forEach((input) => {
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
    const filtersData = yield utils_1.getDataJSON('./dist/data/filters.json');
    const filters = filtersData.map((filter) => new Filter_1.Filter(filter));
    const searchFilter = (filterName) => filters.filter(filter => filter.name == filterName)[0];
    //filtersData.forEach()
    const effectsChain = yield utils_1.getDataJSON('./dist/data/configuration.json');
    console.log(effectsChain);
    const getFilterComplex = () => {
        let keys = Object.keys(effectsChain);
        let last_outputs = [];
        let effects_lines = [];
        keys.forEach((effect, index, array) => {
            let filter = searchFilter(effect);
            if (!filter)
                return; // break if filter doesnt exists
            let options = {};
            if (index == array.length - 1)
                options['final'] = true; // add final option if last
            let params = effectsChain[effect]; // take the params
            let out = filter.call(params, last_outputs, options); // call the filter
            effects_lines.push(out.line); // save the line
            last_outputs = out.outputs; // save the output
        });
        //console.log(effects_lines)
        return effects_lines.join(';');
    };
    //console.log(getFilterComplex());
    yield inputs.forEach((input, index) => __awaiter(void 0, void 0, void 0, function* () {
        let filename = input_files[index];
        let ffmpegCommand = [
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
        let t = yield child_process_1.spawnSync("powershell.exe", ffmpegCommand);
        console.log(t.stdout.toString());
        console.log(t.output.toString());
        console.log(t.stderr.toString());
    }));
});
main();
