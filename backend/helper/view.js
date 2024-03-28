import listEndpoints from 'express-list-endpoints';
import { readFile, readFileSync } from 'fs';
import path from "path";

//Data Structure
const intialPath =  'public/';

export function view(filePath, res){
    readFile( path.resolve(intialPath+filePath) , 'utf-8', (err, data)=>{
        res.send(data);
    });
}

//NEED listEndpoints
export function printEndpoints(expressApp){
    return listEndpoints(expressApp).map(x=>`${x.methods.join(",")} ${x.path} Controller:${x.middlewares.join(",")}`).join("\n");
}