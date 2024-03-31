import { Link, useNavigate } from "react-router-dom"
import { GoogleSignIn } from "./Main"
import PagePlate from "../utilities/PagePlate"
import { useReducer } from "react";
import { ApiSignup, ApiVerifySignUp } from "../helper/API";
import { auth } from "../helper/Auth";




export function Signup(){
    
    return <PagePlate clean={true}>
        <main className="absolute h-full w-full flex flex-col justify-center items-center gap-y-2">
            <div className="w-96 rounded-lg p-8 bg-zinc-900">
                <h2 className="my-header-big">Signup</h2>
                <p className="text-yellow-500/50">Already have an account? <Link to="/login" className=" underline">Login</Link> instead.</p>
                <div className="mb-12"></div>
                <SignupForm/>
            </div>
            <div className="mt-2 text-center text-yellow-500/50 font-thin">
                Other Signing Option
            </div>
            <GoogleSignIn />
        </main>
    </PagePlate>
}

export function SignupForm(){
    //Global
    const navigation = useNavigate();

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
        confirmPassword: {value: "", error:""},
    });

    //functionality
    function submitData(e){
        e.preventDefault();
        ApiSignup({
            username: data.username.value,
            password: data.password.value,
            confirmPassword: data.confirmPassword.value,
        }).then(x=>{
            if(x.status == 200){
                auth.storeToken(x.data.token);
                navigation("/dashboard");
            }else if(x.status == 422){
                console.log(x);
                Object.keys(x.data).forEach(key=>{
                    dataCast({run:"updateError", key:key, val:x.data[key]});
                });
            }
        })
    }

    function verifyData(e){
        const {name, value} = e.target;
        dataCast({run:"updateValue", key:name, val:value});
        const formData = {[name]: value};
        if(name == "confirmPassword")
            formData.password = data.password.value;
        ApiVerifySignUp(name, formData).then(x=>{
            if(x.status == 200){
                dataCast({run:"updateError", key:name, val:""});
            }else if(x.status == 422){
                dataCast({run:"updateError", key:name, val:x.data[name]});
            }
        })
        
    }

    return <form className="" onSubmit={submitData}>
         <div className="mb-2">
            <label>Username</label>
            <input type="text" name="username" value={data.username.value} onInput={verifyData} 
                className={`${data.username.error?"my-field-error":"my-field"} w-full`} 
                placeholder="Johnny" 
            />
            <small className=" my-error-text">{data.username.error}</small>
        </div>
        <div className="mb-2">
            <label>Password</label>
            <input type="password" name="password" value={data.password.value} onInput={verifyData} 
                className={`${data.password.error?"my-field-error":"my-field"} w-full`} 
                placeholder="mY$ec9et" 
            />
            <small className=" my-error-text">{data.password.error}</small>
        </div>
        {   data.password.value !== "" ? <>
            <div className="mb-2 a-fade-in">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={data.confirmPassword.value} onInput={verifyData} 
                    className={`${data.confirmPassword.error?"my-field-error":"my-field"} w-full`} 
                    placeholder="mY$ec9et" 
                />
                <small className=" my-error-text">{data.confirmPassword.error}</small>
            </div>
        </>:<>
        </>
        }
        
        <div className="mt-7 flex justify-center">
            <button type="submit" className="my-main-btn-big">Signup</button>
        </div>
        
    </form>
}