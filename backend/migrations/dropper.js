import { accountTable } from "./_01_createAccount.js";
import { loginTokenTable } from "./_02_createLoginToken.js";
import { financeTable } from "./_03_createFinance.js";

//Import and call the migrations here
let tables = [
    financeTable,
];


//InHouseRunner
tables.forEach(x=>{
    dropThis(x);
});
function dropThis(table){
    table.drop();
    table.exist((cap)=>{
       if(cap){
            dropThis(table);
       } 
    })
}