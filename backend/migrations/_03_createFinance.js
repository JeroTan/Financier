import { db } from "./define.js";
import { tableCreation } from "./define.js";

export const financeTable = new tableCreation("finance");
financeTable.addColumn( t=>t.increments("id").primary() )
    .addColumn(t=>t.integer("accountId").unsigned())
        .addColumn(t=>t.foreign('accountId').references('id').inTable('account').onDelete("CASCADE").onUpdate("CASCADE") )
    .addColumn(t=>t.bigint("expenseWhole").notNullable())
    .addColumn(t=>t.integer("expenseDecimal").nullable())
    .addColumn(t=>t.boolean("expenseSign").notNullable())
    .addColumn(t=>t.string("expenseFrom").notNullable())
    .addColumn(t=>t.text("description").nullable())
    .addColumn(t=>t.datetime("time").notNullable());

