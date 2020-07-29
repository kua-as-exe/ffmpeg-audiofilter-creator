"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterComplex = void 0;
const Filter_1 = require("./Filter");
exports.getFilterComplex = (effectsParams, filters) => {
    let effects_lines = [];
    effectsParams.forEach((effect) => {
        let inputs = [];
        let outputs = 1;
        let currentFilter = filters.filter(filter => filter.id == effect.id)[0];
        let out = Filter_1.getFilterLine(inputs, outputs, effect, currentFilter); // call the filter
        effects_lines.push(out.line); // save the line
    });
    console.log(effects_lines);
    return effects_lines.join(';');
};
