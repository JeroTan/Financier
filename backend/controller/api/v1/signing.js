import { jwtDecode } from "jwt-decode";
import { view } from "../../../helper/view.js";
import { db } from "../../../migrations/define.js";
import { hashData, tokenAuth, tokenHash, updateDbHashData } from "../../../helper/tokenizer.js";
import { createRandomUsername } from "../../../helper/randomizer.js";
import { Validation } from "../../../helper/validation.js";
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
        const {username, password, confirmPassowrd} = req.body;

    },
    logout: (req, res)=>{

    },
    verifyUsername: (req, res)=>{
        const {username} = req.body;
        const valUsername = new Validation(username, "Username");
        valUsername.actualFieldName("username").required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).max(32).validate(res);
        
    },
    verifyPassword: (req, res)=>{
        const {password} = req.body;
        const valPassword = new Validation(password, "Password");
        valPassword.actualFieldName("password").required().min(8).max(128).validate(res);
    },
    verifyConfirmPasswrd: (req, res)=>{
        const {password, confirmPassowrd} = req.body;
        const valPassword = new Validation(password, "Password");
        const valConfirmPassword = new Validation(confirmPassowrd, "Confirm Password");
        valConfirmPassword.actualFieldName("confirmPassword").required().same([valPassword]).validate(res);
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
            const newAccountId = await db("account").returning('id').insert({ username:createRandomUsername(), email:email, password: await hashData(sub) });
            const token = tokenAuth(newAccountId);
            res.status(200).json({
                result: "needUsername",
                token: token,
            });
        })();

    },
    
    updateUsername: (req, res)=>{
        
    },
    updateEmail: (req, res)=>{

    },
    updatePassword: (req, res)=>{

    },
}
