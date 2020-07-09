"use strict";
//import { request, ServerResponse } from 'http'
var express = require('express');
var app = express();
var SERVER_PORT = 1234;
//const bodyParser = require('body-parser');
//const session = require('express-session');
//app.use(session({secret: 'idk'}))
//app.use(bodyParser.json())
app.get('/api/conection', function (req, res) {
    console.log(req);
    res.send({ status1: true });
});
app.get('/api', function (req, res) {
    console.log(req);
    res.send({ status2: true });
});
app.get('/', function (req, res) {
    console.log(req);
    res.send({ text: "wtf" });
});
app.listen(SERVER_PORT, function () { return console.log("Server running"); });
