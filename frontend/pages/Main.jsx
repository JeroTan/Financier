import { GoogleLogin } from "@react-oauth/google";
//Components/Helper
import { ApiLoginWithGoogle } from "../helper/API";
import PagePlate from "../utilities/PagePlate";
import {Login} from "./Login";


export const Main = ()=>{

    return <Login />
}

//Independent Components
export function GoogleSignIn(){
    
    return <GoogleLogin
        onSuccess={r => {
            ApiLoginWithGoogle(r.credential).then(x=>console.log(x));
        }}
        onError={() => {
            console.error('Login Failed');
        }}
    />;
}