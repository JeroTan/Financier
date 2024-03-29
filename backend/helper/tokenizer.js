import jwt from "jsonwebtoken"; //need
import bcrypt from "bcrypt";
import 'dotenv/config';
import { db } from "../migrations/define.js";
const ExpiresIn = process.env.JWT_EXPIRES;
const Secret = process.env.JWT_SECRET;
console.log(ExpiresIn, Secret);



export function tokenAuth(id){
    return jwt.sign({id:id}, Secret, { expiresIn: ExpiresIn});
}

export function tokenRead(token, zawardo=false){
    try{
        return jwt.verify(token, Secret, {ignoreExpiration: zawardo});
    }catch(e){
        console.error(e);
        return false;
    }
}

export function tokenHash(data){
    return jwt.sign(data, Secret, { expiresIn: ExpiresIn});
}

//bcrypt
export async function hashData(data){
    return await new Promise((resolve, reject)=>{
        bcrypt.hash(data, 10, (err, hash)=>{
            resolve(hash);
        });
    });
}
export async function checkHash(data, hash){
    return await new Promise((resolve, reject)=>{
        bcrypt.compare(data, hash, (err, result)=>{
            resolve(result);
        })
    });
}



////COMPOUND HELPER | REQUIRing more dependencies;
export function updateDbHashData(id, data={}){
    const hashData = tokenHash(data);
    db("loginToken").where({id: id}).first().then(data=>{
        if(data){
            db("loginToken").insert({accountId: id, hashData: hashData});
        }else{
            db("loginToken").where({id:data.id}).update({hashData: hashData});
        }
    });
}

export function dropDbHashData(id){
    db("loginToken").where({id: id}).first().then(data=>{
        if(data){
            db("loginToken").where({id: data.id}).del();
        }
    });
}


