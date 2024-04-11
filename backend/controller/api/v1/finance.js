import { separateNumber } from "../../../helper/math.js";
import { tokenRead } from "../../../helper/tokenizer.js";
import { Validation, generateValidateInstance, multiValidate } from "../../../helper/validation.js";
import { db } from "../../../migrations/define.js";


//InHouseHelpers

export const Finance = {
    suggestWord: (req,res)=>{
        const {search} = req.query; //Make Filterer for query;
        (async()=>{
            const result = await db("finance").pluck("amountFrom").whereRaw("LOWER(amountFrom) = ?", [`%${search}%`]).limit(10);
            //This doesn't seems to work
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