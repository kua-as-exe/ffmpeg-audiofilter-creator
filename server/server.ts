import { getDataJSON } from "../src/utils";
import { FilterOptions } from "../src/Filter";

const express = require('express');
const app = express();

const SERVER_PORT = 1234;

//const bodyParser = require('body-parser');
//const session = require('express-session');

//app.use(session({secret: 'idk'}))
//app.use(bodyParser.json())

const getFilters = (): Promise<FilterOptions[]> => getDataJSON('./dist/data/filters.json');

app.get('/api/getFilters',  async (req: any, res: any) => {
    let filtersData = await getFilters();
    if(!filtersData) res.send({})
    res.send(filtersData)
})
app.get('/api/getFilter', async (req: any, res: any) => {
    console.log(req);
    let filterName:string = req.query.filterName
    let filtersData = await getFilters();
    let filter:FilterOptions = filtersData.filter( filter => filter.name == filterName )[0]
    res.send(filter)
})

app.get('/', (req:any, res: any) => {
    console.log(req);
    res.send({text: "wtf"})
})

app.listen(SERVER_PORT, ()=>console.log("Server running"))
