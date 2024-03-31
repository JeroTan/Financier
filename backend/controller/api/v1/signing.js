import { jwtDecode } from "jwt-decode";
import { view } from "../../../helper/view.js";
import { db } from "../../../migrations/define.js";
import { dropDbHashData, hashData, tokenAuth, tokenHash, tokenRead, updateDbHashData } from "../../../helper/tokenizer.js";
import { createRandomUsername } from "../../../helper/randomizer.js";
import { Validation, generateValidateInstance, getPostData, getPostDataOpt, multiValidate } from "../../../helper/validation.js";
/**
 * Every Callback here must be or optional if you want to have req and res
 * req means request or the requesting data or payload
 * res mean what will be the response or to send the response back;
 */


/**
 * @Login Success Result Data
 * needUsername = User must give a username to their new account | Token is however generated
 * success = the token is generated and ready to direct from profile page
 * 
 */



export default {
    login: (req, res)=>{

    },
    signup: (req, res)=>{
        const {username, password, confirmPassword} = getPostData(req.body, ["username", "password", "confirmPassword"], res);
        const valInst = generateValidateInstance(3);
        valInst[0].addInput(username).addField("Username").addActualField("username")
            .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).unique("account,username").max(32);
        valInst[1].addInput(password).addField("Password").addActualField("password")
            .required().min(8).max(128);
        valInst[2].addInput(confirmPassword).addField("Confirm Password").addActualField("confirmPassword")
            .required().same([valInst[1]]);
        
        (async()=>{
            const validateResult =  await multiValidate(valInst);
            if(Object.keys(validateResult).length > 0){
                return res.status(422).json(validateResult);
            }

            const id = await db("account").returning("id").insert({
                username: username,
                password: await hashData(password),
            })
            const token = tokenAuth(id);
            updateDbHashData(id, {username: username});
            res.status(200).json({
                result: "success",
                token: token,
            })            

        })();
    },
    
    verifySignup: (req, res)=>{
        const valInst = new Validation;
        const param = req.query.field ?? "";
        const body = getPostDataOpt(req.body, ["username", "password", "confirmPassword"]);
        switch(param){
            case "username":
                valInst.addInput(body.username).addField("Username").addActualField("username")
                    .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).unique("account,username").max(32).validate(res);
            break;
            case "password":
                valInst.addInput(body.password).addField("Password").addActualField("password")
                    .required().min(8).max(128).validate(res);
            break;
            case "confirmPassword":
                const valInst2 = new Validation(body.password, "Password");
                valInst.addInput(body.confirmPassword).addField("Confirm Password").addActualField("confirmPassword")
                    .required().same([valInst2]).validate(res);
            break;
        }
        
        
    },
    loginGoogle: (req, res)=>{
        const credentials = req.body.credentials;
        const {email, sub, aud} = jwtDecode(credentials);
        (async ()=>{
            const checkAccount = await db("account").where({email:email}).first();
            if(checkAccount){
                const token = tokenAuth(checkAccount.id);
                updateDbHashData(checkAccount.id, {username: checkAccount.username});
                res.status(200).json({
                    result: "success",
                    token: token,
                });
                return;
            }
            const newUsername = createRandomUsername();
            const newAccountId = await db("account").returning('id').insert({ 
                username:newUsername, 
                email:email, password: 
                await hashData(sub) 
            });
            const token = tokenAuth(newAccountId);
            updateDbHashData(newAccountId, {username: newUsername});
            res.status(200).json({
                result: "needUsername",
                token: token,
            });
        })();

    },
    
    updateUsername: (req, res)=>{
        
    },

    verifyAuth: (req, res)=>{
        const result = tokenRead(req.token);
        if(result === false)
            return res.sendStatus(401); 
        
        res.sendStatus(200);
    },
    
}
