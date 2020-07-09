//import { request, ServerResponse } from 'http'
const express = require('express');
const app = express();

const SERVER_PORT = 1234;

//const bodyParser = require('body-parser');
//const session = require('express-session');

//app.use(session({secret: 'idk'}))
//app.use(bodyParser.json())

app.get('/api/conection', (req: any, res: any) => {

    res.send("OLA")
})

app.get('*', (req:any, res: any) => {
    res.send("BIEN")
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))
