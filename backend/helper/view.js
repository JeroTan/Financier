import { readFile, readFileSync } from 'fs';

export function view(filePath, res){
    readFile(filePath, 'utf-8', (err, data)=>{
        res.send(data);
    });
}