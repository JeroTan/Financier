import { readFile, readFileSync } from 'fs';
import path from "path";

//Data Structure
const intialPath =  'public/';

export function view(filePath, res){
    readFile( path.resolve(intialPath+filePath) , 'utf-8', (err, data)=>{
        res.send(data);
    });
}
