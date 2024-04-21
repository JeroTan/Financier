import { tokenRead } from "../../../helper/tokenizer.js";
import { db } from "../../../migrations/define.js";


export const Profile = {
    username: (req, res)=>{
        const accountId = tokenRead(req.token).id;

        (async()=>{
            const result = await db("account").where({id:accountId}).first();
            res.status(200).json(result.username);
        })();
    }
}