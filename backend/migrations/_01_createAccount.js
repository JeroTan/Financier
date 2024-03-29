import { db } from "./define.js";
import { tableCreation } from "./define.js";


export const accountTable = new tableCreation("account");
accountTable.addColumn( t=>t.increments("id").primary() )
    .addColumn(t=>t.string("username", 32).notNullable())
    .addColumn(t=>t.string("email").nullable())
    .addColumn(t=>t.string("password").notNullable());
