import { combineNumber, separateNumber, transformDate } from "../../../helper/math.js";
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
        const {dateFrom, dateTo, search, amountFrom, amountTo, type, sortName, sortAmount, load } = req.query;
        const valInst = generateValidateInstance(9);
        const accountId = tokenRead(req.token).id;
        
        valInst[0].addInput(dateFrom).addField("dateFrom")
            .required().date();
        valInst[1].addInput(dateTo).addField("dateTo")
            .required().date();
        valInst[2].addInput(search).addField("search")
            .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).max(256);
        valInst[3].addInput(amountFrom).addField("amountFrom")
            .required().number(true).min(-(10**20)).max(10**20);
        valInst[4].addInput(amountTo).addField("amountTo")
            .required().number(true).min(-(10**20)).max(10**20);
        valInst[5].addInput(type).addField("type")
            .required().string().match(["earn", "expense", "all"]);
        valInst[6].addInput(sortName).addField("sortName")
            .required().string().match(["asc", "desc"]);
        valInst[7].addInput(sortAmount).addField("sortAmount")
            .required().string().match(["asc", "desc"]);
        valInst[8].addInput(load).addField("load")
            .required().number().min(1);

        (async ()=>{
            //prepare DB
            const querying =  db("finance").select('id', 'amountWhole', 'amountDecimal', 'amountSign', 'amountFrom', 'description', 'time').where({accountId: accountId});

            //DateFrom & //DateTo
            const dateFromFinal =  (await valInst[0].validate())===true ? new Date(dateFrom) : new Date(0);
            const dateToFinal = (await valInst[1].validate())===true ? new Date(dateTo) : new Date();
            querying.whereBetween("time", [ transformDate(dateFromFinal, "iso"), transformDate(dateToFinal, "iso")]);

            //Search
            if(await valInst[2].validate() === true)
                querying.whereRaw("LOWER(amountFrom) LIKE ?", [`%${search.toLowerCase()}%`]);

            //AmountFrom & AmountTo
            if(await valInst[3].validate() === true){
                const splitNum = separateNumber(amountFrom);
                querying.where("amountWhole", ">=", splitNum.whole);
            }
            if(await valInst[4].validate() === true){
                const splitNum = separateNumber(amountTo);
                querying.where("amountWhole", "<=", splitNum.whole);
            }

            //Type &
            if(await valInst[5].validate() === true)
                querying.where({amountSign:type==="expense"});
            
            
            //Ordering of AmountFrom
            if(await valInst[6].validate() === true)
                querying.orderBy("amountFrom", sortName);

            //Ordering of Amount
            if(await valInst[7].validate() === true){
                querying.orderBy("amountWhole", sortAmount);
                querying.orderBy("amountDecimal", sortAmount);
            }
            
            //Only Go here if requesting for pagination
            if(await valInst[8].validate() === true){
                const dataToSend = await querying.limit(25).offset( load );
                const nextDataToSend = await querying.limit(25).offset( load+1 );
                return res.status(200).json({
                    list:dataToSend,
                    next: nextDataToSend.length > 0,
                })

            }

            const result = await querying;
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
    },

    getCurrency: (req, res)=>{
        const accountId = tokenRead(req.token).id;

        (async()=>{
            //GET the profile

            //Check the contents of profile; especially the currency

            res.status(200).json(50);
        })();


    },
}