import { db } from "./define.js";
import { tableCreation } from "./define.js";


export const loginTokenTable = new tableCreation("loginToken");
loginTokenTable.addColumn( t=>t.increments("id").primary() )
    .addColumn(t=>t.integer("accountId").unsigned())
        .addColumn(t=>t.foreign('accountId').references('id').inTable('account').onDelete("CASCADE").onUpdate("CASCADE") )
    .addColumn(t=>t.text("hashData").notNullable());
