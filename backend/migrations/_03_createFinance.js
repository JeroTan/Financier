import { db } from "./define.js";
import { tableCreation } from "./define.js";

export const financeTable = new tableCreation("finance");
financeTable.addColumn( t=>t.increments("id").primary() )
    .addColumn(t=>t.integer("accountId").unsigned())
        .addColumn(t=>t.foreign('accountId').references('id').inTable('account').onDelete("CASCADE").onUpdate("CASCADE") )
    .addColumn(t=>t.bigint("amountWhole").notNullable())
    .addColumn(t=>t.integer("amountDecimal").nullable())
    .addColumn(t=>t.boolean("amountSign").notNullable())
    .addColumn(t=>t.string("amountFrom").notNullable())
    .addColumn(t=>t.text("description").nullable())
    .addColumn(t=>t.datetime("time").notNullable());

