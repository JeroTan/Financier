import { db } from "../../../migrations/define.js";

export const AddFinance = {
    suggestWord: (req,res)=>{
        const {search} = req.query; //Make Filterer for query;
        (async()=>{
            const result = await db("finance").pluck("amountFrom").whereRaw("LOWER(amountFrom) = ?", [`%${search}%`]);
            res.status(200).json(result);
        })();
    },

    verifyForm: (req, res)=>{
        const {field} = req.query;
    }
}