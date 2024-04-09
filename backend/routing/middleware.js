import { tokenRead } from "../helper/tokenizer.js";
import { getPostData, getPostDataOpt } from "../helper/validation.js";


export function verifyAuth(req, res, next){//Return next() if token is open else return res error 401
    const result = tokenRead(req.token);
    if(result === false)
        return res.sendStatus(401);
    return next();
}

export function requiredData(dataKey){ //the data should be present in the body request
    return (req, res, next)=>{
        const result = getPostData(req.body, dataKey, res);
        if(result)
            return next();
    }
}

export function optionalData(dataKey){ //the data will be filled with empty value of not present in body request instead
    return (req, res, next)=>{
        const result = getPostDataOpt(req.body, dataKey, res);
        if(result){
            req.body = result;
            return next();
        }
    }
}

export function optionalQuery(dataKey){
    return (req, res, next)=>{
        const result = getPostDataOpt(req.query, dataKey, res);
        if(result){
            req.query = result;
            return next();
        }
    }
}