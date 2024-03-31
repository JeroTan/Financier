import { ApiVerifyAuth } from "./API";

class Auth{
    storeToken(token){
        localStorage.setItem('token', token);
    }
    getToken(){
        if(this.tokenExist()){
            return localStorage.getItem('token');
        }
        return "";
        
    }
    removeToken(){
        if(this.tokenExist()){
            localStorage.removeItem('token');
        }
    }
    tokenExist(){
        if(localStorage.getItem('token') === null){
            return false;
        }
        return true;

    }
    verifyToken(){
        const ThisRemoveToken = this.removeToken;
        return new Promise((resolve, reject)=>{
            if(!this.tokenExist()){
                return resolve(false);
            }
            ApiVerifyAuth().then(x=>{
                if(x.status ===  200){
                    return resolve(true);
                }else if(x.status === 401){
                    ThisRemoveToken();
                    return resolve(false);
                }
            });
        });
    }
}

export const auth = new Auth;