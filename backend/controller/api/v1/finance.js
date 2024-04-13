import { separateNumber, toISODateFormat } from "../../../helper/math.js";
import { tokenRead } from "../../../helper/tokenizer.js";
import { Validation, generateValidateInstance, multiValidate } from "../../../helper/validation.js";
import { db } from "../../../migrations/define.js";


//InHouseHelpers

export const Finance = {
    suggestWord: (req,res)=>{
        const {search} = req.query; //Make Filterer for query;
        (async()=>{
            if(search === ""){
                return res.status(200).json([]);
            }
            const result = await db("finance").pluck("amountFrom").whereRaw("LOWER(amountFrom) LIKE ?", [`%${search.toLowerCase()}%`]).limit(10);
            //This doesn't seems to work here
            res.status(200).json(result);
        })();
    },

    verifyForm: (req, res)=>{
        const {field} = req.query;
        const valInst = new Validation;
        const {amount, amountFrom, description, time} = req.body;

        switch(field){
            case "amount":
                valInst.addInput(amount).addField("amount")
                    .required().number(true).min(-(10**20)).max(10**20).validate(res);
            break;
            case "amountFrom":
                valInst.addInput(amountFrom).addField("amountFrom").addNameAttribute("Amount From")
                    .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).max(256).validate(res);
            break;
            case "description":
                valInst.addInput(description).addField("description")
                    .string().max(4096).validate(res);
            break;
            case "time":
                valInst.addInput(time).addField("time")
                    .required().date().validate(res);
            break;
        }
    },

    get: (req, res)=>{
        const {dateFrom, dateTo} = req.query;
        const valInst = generateValidateInstance(2);
        const accountId = tokenRead(req.token).id;
        
        valInst[0].addInput(dateFrom).addField("dateFrom")
            .required().date();
        valInst[1].addInput(dateTo).addField("dateTo")
            .required().date();

        (async ()=>{
            const dateFromResult = await valInst[0].validate();
            const dateToResult =  await valInst[1].validate();

            const dateFromFinal = dateFromResult===true ? new Date(dateFrom) : new Date(0);
            const dateToFinal = dateToResult===true ? new Date(dateTo) : new Date();

            const result = await db("finance").select('id', 'amountWhole', 'amountDecimal', 'amountSign', 'amountFrom', 'description', 'time').where({accountId: accountId}).whereBetween("time", [ toISODateFormat(dateFromFinal), toISODateFormat(dateToFinal)]);

            res.status(200).json(result);
        })();
    },

    add: (req, res)=>{
        const {amount, amountFrom, description, time} = req.body;
        const accountId = tokenRead(req.token).id;
        const valInst = generateValidateInstance(4);

        valInst[0].addInput(amount).addField("amount")
            .required().number(true).min(-(10**20)).max(10**20);
        valInst[1].addInput(amountFrom).addField("amountFrom").addNameAttribute("Amount From")
            .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).max(256);
        valInst[2].addInput(description).addField("description")
            .string().max(4096);
        valInst[3].addInput(time).addField("time")
            .required().date();

        (async ()=>{
            const validateResult =  await multiValidate(valInst);
            
            if(Object.keys(validateResult).length > 0)
                return res.status(422).json(validateResult);
            else{
                const {sign, whole, decimaal} = separateNumber(amount);


                await db("finance").insert({
                    accountId: accountId, 
                    amountWhole: whole, 
                    amountDecimal: decimaal, 
                    amountSign: sign, 
                    amountFrom: amountFrom, 
                    description: description, 
                    time: time
                });
                return res.sendStatus(200);
            }
        })();
    }
}