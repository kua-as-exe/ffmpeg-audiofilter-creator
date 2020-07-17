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
const utils_1 = require("../src/utils");
const express = require('express');
const app = express();
const SERVER_PORT = 1234;
//const bodyParser = require('body-parser');
//const session = require('express-session');
//app.use(session({secret: 'idk'}))
//app.use(bodyParser.json())
const getFilters = () => utils_1.getDataJSON('./dist/data/filters.json');
app.get('/api/getFilters', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtersData = yield getFilters();
    if (!filtersData)
        res.send({});
    res.send(filtersData);
}));
app.get('/api/getFilter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    let filterName = req.query.filterName;
    let filtersData = yield getFilters();
    let filter = filtersData.filter(filter => filter.name == filterName)[0];
    res.send(filter);
}));
app.get('/', (req, res) => {
    console.log(req);
    res.send({ text: "wtf" });
});
app.listen(SERVER_PORT, () => console.log("Server running"));
