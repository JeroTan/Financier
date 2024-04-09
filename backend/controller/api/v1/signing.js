import { jwtDecode } from "jwt-decode";
import { view } from "../../../helper/backendUtilities.js";
import { db } from "../../../migrations/define.js";
import { checkHash, dropDbHashData, hashData, tokenAuth, tokenHash, tokenRead, updateDbHashData } from "../../../helper/tokenizer.js";
import { createRandomUsername } from "../../../helper/randomizer.js";
import { Validation, generateValidateInstance, getPostData, getPostDataOpt, multiValidate } from "../../../helper/validation.js";
import { Controller } from "../../plate.js";
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
        const {username, password} = req.body;
        
        (async()=>{
            const result = await db("account").where({username: username}).first();

            if(!result)
                return res.sendStatus(401);
            
            const verifyPassword = await checkHash(password, result.password);
            if(!verifyPassword)
                return res.sendStatus(401);
    
            const token = tokenAuth(result.id);
            updateDbHashData(result.id, {username: result.username});
            res.status(200).json({
                result: "success",
                token: token,
            })
                
            
        })();
    },

    signup: (req, res)=>{
        const {username, password, confirmPassword} = req.body;

        const valInst = generateValidateInstance(3);
        valInst[0].addInput(username).addField("Username").addActualField("username")
            .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).unique("account,username").max(32);
        valInst[1].addInput(password).addField("Password").addActualField("password")
            .required().min(8).max(128);
        valInst[2].addInput(confirmPassword).addField("Confirm Password").addActualField("confirmPassword")
            .required().same([valInst[1]]);
        
        (async()=>{
            const validateResult =  await multiValidate(valInst);
            if(Object.keys(validateResult).length > 0)
                return res.status(422).json(validateResult);

            const newAccount = await db("account").returning("id").insert({
                username: username,
                password: await hashData(password),
            })
            const token = tokenAuth(newAccount[0].id);
            updateDbHashData(newAccount[0].id, {username: username});
            res.status(200).json({
                result: "success",
                token: token,
            })            

        })();
    },
    
    verifySignup: (req, res)=>{
        const valInst = new Validation;
        const field = req.query.field;
        const {username, password, confirmPassword} = req.body;

        switch(field){
            case "username":
                valInst.addInput(username).addField("Username").addActualField("username")
                    .required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).unique("account,username").max(32).validate(res);
            break;
            case "password":
                valInst.addInput(password).addField("Password").addActualField("password")
                    .required().min(8).max(128).validate(res);
            break;
            case "confirmPassword":
                const valInst2 = new Validation(password, "Password");
                valInst.addInput(confirmPassword).addField("Confirm Password").addActualField("confirmPassword")
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
            const newAccount = await db("account").insert({ 
                username:newUsername, 
                email:email, password: 
                await hashData(sub) 
            }, ['id']);
     
            const token = tokenAuth(newAccount[0].id);
            updateDbHashData(newAccount[0].id, {username: newUsername});
            res.status(200).json({
                result: "needUsername",
                token: token,
            });
        })();

    },
    
    setupUsername: (req, res)=>{
        const {username} = req.body;

        const valInst = new Validation(username, "username");
        valInst.addActualField("username").required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).unique("account,username").max(32);

        (async()=>{
            const result = await valInst.validate();
            if(result !== true){
                return res.status(422).json(result);
            }else{
                const id = tokenRead(req.token).id;
                await db("account").where({id:id}).update({username: username});
                return res.sendStatus(200);
            }
        })();

    },

    verifyAuth: (req, res)=>{
        const result = tokenRead(req.token);
        if(result === false)
            return res.sendStatus(401); 
        
        res.sendStatus(200);
    },
    
}
