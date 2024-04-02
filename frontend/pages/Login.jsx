//ReactHooks
import { useContext, useEffect, useMemo, useReducer } from "react"
//Imports
import { Link, useNavigate } from "react-router-dom";
//Components
import { GoogleSignIn } from "./Main";
import PagePlate from "../utilities/PagePlate";
import { ApiLogin } from "../helper/API";
import { GlobalConfigContext } from "../utilities/GlobalConfig";
import { Pop } from "../utilities/Pop";
import { auth } from "../helper/Auth";


export const Login = ()=>{
    
    return <PagePlate clean={true}>
        <main className="absolute h-full w-full flex flex-col justify-center items-center gap-y-2">
            <div className="w-96 rounded-lg p-8 bg-zinc-900">
                <h2 className="my-header-big">Login</h2>
                <p className="text-yellow-500/50">No account yet? <Link to="/signup" className=" underline">Sign-up</Link> instead.</p>
                <div className="mb-12"></div>
                <LoginForm />            
            </div>
            <div className="mt-2 text-center text-yellow-500/50 font-thin">
                Other Signing Option
            </div>
            <GoogleSignIn />
        </main>
    </PagePlate>
}

function LoginForm(){
    //Global
    const [gConfig, gConfigCast] = useContext(GlobalConfigContext);
    const navigation = useNavigate();

    //Data Modifier
    const [ data, dataCast ] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "updateValue":
                refState[action.key].value = action.val;
            break;
            case "updateError":
                refState[action.key].error = action.val;
            break;
        };
        return refState;
    }, {
        username: {value: "", error:""},
        password: {value: "", error:""},
    });

    //Functionality
    function submitData(e){
        e.preventDefault();
        const pop = new Pop(gConfig, gConfigCast);
        pop.type("loading").message("Authenticating. . .");
        ApiLogin({
            username: data.username.value,
            password: data.password.value,
        }).then(x=>{
            if(x.status == 200){
                pop.type("success").title("Login Successfully").message("Welcome to Financier").button(true, false, false, true);
                auth.storeToken(x.data.token);
                navigation("/dashboard");
                return;
            }else if(x.status == 401){
                return pop.type("error").title("Login Failed").message("Username and password did not match. Please try again.").button(true, false);
            }
            return pop.type("error").title("Login Failed").message("Something happened on our end! Please try again later.").button(true, false);
        })
    }
    function inputData(e){
        const {value, name} = e.target;
        dataCast({run:"updateValue", key:name, val:value});
    }

    return <form onSubmit={submitData}>
        <div className="mb-2">
            <label>Username</label>
            <input type="text" name="username" className="my-field w-full" value={data.username.value} onInput={inputData}  placeholder="" />
        </div>
        <div className="mb-2">
            <label>Password</label>
            <input type="password" name="password" className="my-field w-full" value={data.password.value} onInput={inputData} placeholder="" />
        </div>
        <div className="mt-7 flex justify-center">
            <button type="submit" className="my-main-btn-big">Login</button>
        </div>
    </form>
}

