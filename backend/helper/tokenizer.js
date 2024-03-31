import jwt from "jsonwebtoken"; //need
import bcrypt from "bcrypt";
import 'dotenv/config';
import { db } from "../migrations/define.js";
const ExpiresIn = Number(process.env.JWT_EXPIRES);
const Secret = process.env.JWT_SECRET;


export function tokenAuth(id){
    return jwt.sign({id:id}, Secret, { expiresIn: ExpiresIn});
}

export function tokenRead(token, zawardo=false){
    try{
        return jwt.verify(token, Secret, {ignoreExpiration: zawardo});
    }catch(e){
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
export function updateDbHashData(accountId, data={}){
    const hashData = tokenHash(data);
    db("loginToken").where({accountId: accountId}).first().then(async data=>{
        if(data){
            await db("loginToken").where({id:data.id}).update({hashData: hashData});
        }else{
            await db("loginToken").insert({accountId: accountId, hashData: hashData});   
        }
    });
}
export function getDbHashData(accountId){
    return new Promise((resolve, reject)=>{
        db("loginToken").where({accountId: accountId}).first().then(data=>{
            resolve(data);
        }).catch(e=>{
            reject(e);
        })
    });
}

export function dropDbHashData(accountId){
    db("loginToken").where({accountId: accountId}).first().then(data=>{
        if(data){
            db("loginToken").where({accountId: data.id}).del();
        }
    });
}


