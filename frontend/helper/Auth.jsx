import { ApiVerifyAuth } from "./API";

class Auth{
    storeToken(token){
        localStorage.setItem('token', token);
    }
    tokenExist(){
        if(localStorage.getItem('token') === null){
            return false;
        }
        return true;

    }
    getToken(){
        if(this.tokenExist()){
            return localStorage.getItem('token');
        }
        return "";
        
    }
    removeToken(){
        if(localStorage.getItem('token') === null)
            return false;
        
        localStorage.removeItem('token');
    }
    verifyToken(){
        const ThisRemoveToken = this.removeToken;
        const ThisTokenExist = this.tokenExist;
        return new Promise((resolve, reject)=>{
            if(!ThisTokenExist()){
                return resolve(false);
            }
            ApiVerifyAuth().then(x=>{
                if(x.status ===  200){
                    return resolve(true);
                }
                ThisRemoveToken();
                return resolve(false);
            });
        });
    }
}

//CALL THIS
export const auth = new Auth;