//import { request, ServerResponse } from 'http'
const express = require('express');
const app = express();

const SERVER_PORT = 1234;

//const bodyParser = require('body-parser');
//const session = require('express-session');

//app.use(session({secret: 'idk'}))
//app.use(bodyParser.json())

app.get('/api/conection', (req: any, res: any) => {
    console.log(req);
    res.send({status1: true})
})
app.get('/api', (req: any, res: any) => {
    console.log(req);   
    res.send({status2: true})
})

app.get('/', (req:any, res: any) => {
    console.log(req);
    res.send({text: "wtf"})
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))
