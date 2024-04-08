import { GoogleLogin } from "@react-oauth/google";
//Components/Helper
import { ApiLoginWithGoogle } from "../helper/API";
import PagePlate from "../utilities/PagePlate";
import { useNavigate } from "react-router-dom";
import {Login} from "./Login";
import { auth } from "../helper/Auth";


export const Main = ()=>{

    return <Login />
}

//Independent Components
export function GoogleSignIn(){
    const navigation = useNavigate();

    
    return <GoogleLogin
        onSuccess={r => {
            ApiLoginWithGoogle(r.credential).then(res=>{
                if(res.status !== 200)
                    return;
                
                if(res.data.result === "success"){
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