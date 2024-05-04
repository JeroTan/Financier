import { accountTable } from "./_01_createAccount.js";
import { loginTokenTable } from "./_02_createLoginToken.js";
import { financeTable } from "./_03_createFinance.js";

//Import and call the migrations here
const tables = [
    accountTable,
    loginTokenTable,
    financeTable,
];


//InHouseRunner
tables.forEach(x=>{
    x.create();
})