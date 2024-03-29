//Define Database here
import knex from "knex";
import path from "path";
import { strArrtToArr } from "../helper/parseArguments.js";
export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve("database/financier.db")
    }
});


//Inhouse Helper


//Table Templates
export class tableCreation{
    constructor(name){
        this.name = name;
        this.column = [];
    }

    addColumn(callback){ //accept t as argument for table
        this.column[this.column.length] =  callback;
        return this;
    }

    exist( callback ){
        db.schema.hasTable(this.name).then(callback);

    }

    create(){
        this.exist((cap)=>{
            if(cap)
                return;
            
            return db.schema.createTable(this.name, (t)=>{
                this.column.forEach(e => {e(t)});
            }).then(()=>{
                console.log(`Table ${this.name} has been created.`);
            });
        });
    }

    reset(){
        this.drop();
        this.create();
        return this;
    }

    drop(){
        this.exist((cap)=>{
            if(!cap)
                return;
            return db.schema.dropTable(this.name).then(()=>{
                console.log(`Table ${this.name} has been removed.`);
            });
        });
    }
}