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
export function file(filePath, res){
    res.sendFile(path.resolve(intialPath+filePath));
}
export function downloadDB(res){
    res.download( path.resolve('database/financier.db') );
}
export function getDBContent(res){
    res.sendFile(path.resolve('database/financier.db'));
}

//NEED listEndpoints
export function printEndpoints(expressApp){
    //return listEndpoints(expressApp).map(x=>`${x.methods.join(",")} ${x.path} Controller:${x.middlewares.join(",")}`).join("\n");
    return listEndpoints(expressApp).map(x=>`${x.methods.join(",")} ${x.path}`).join("\n");
}