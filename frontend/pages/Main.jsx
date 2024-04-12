import { GoogleLogin } from "@react-oauth/google";
//Components/Helper
import { ApiLoginWithGoogle } from "../helper/API";
import PagePlate from "../utilities/PagePlate";
import { useNavigate } from "react-router-dom";
import {Login} from "./Login";
import { auth } from "../helper/Auth";
import { useContext } from "react";
import { GlobalConfigContext } from "../utilities/GlobalConfig";
import { Pop } from "../utilities/Pop";


export const Main = ()=>{

    return <Login />
}

//Independent Components
export function GoogleSignIn(){
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);


    const navigation = useNavigate();

    
    return <GoogleLogin
        onSuccess={r => {
            const pop = new Pop(gConfig, gConfigCast);
            pop.type("loading").message("Authenticating. . .");
            ApiLoginWithGoogle(r.credential).then(res=>{
                if(res.status !== 200)
                    return;
                
                if(res.data.result === "success"){
                    pop.type("success").title("Login Successfully").message("Welcome to Financier").button(true, false, false, true);
                    auth.storeToken(res.data.token);
                    navigation('/dashboard');
                    return;
                }
                //Need new Username;
                auth.storeToken(res.data.token);
                navigation('/username');
            });
        }}
        onError={() => {
            console.error('Login Failed');
        }}
    />;
}