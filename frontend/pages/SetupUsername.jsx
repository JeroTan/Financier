import { useContext, useReducer } from "react";
import PagePlate from "../utilities/PagePlate";
import { Pop } from "../utilities/Pop";
import { ApiSetupUsername, ApiVerifySignUp } from "../helper/API";
import { GlobalConfigContext } from "../utilities/GlobalConfig";
import { useNavigate } from "react-router-dom";

export function SetupUsername(){
    return <PagePlate clean={true}>
        <main className="absolute h-full w-full flex flex-col justify-center items-center gap-y-2">
            <div className="w-96 rounded-lg p-8 bg-zinc-900">
                <UsernameForm />
            </div>
        </main>
    </PagePlate>
}

function UsernameForm(){
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
    });

    //Functionality
    function submitData(e){
        e.preventDefault();
        const pop = new Pop(gConfig, gConfigCast);
        pop.type("loading").message("Setting Username. . .");
        ApiSetupUsername({
            username: data.username.value,
        }).then(x=>{
            if(x.status == 200){
                pop.type("success").title("Login Successfully").message("Welcome to Financier").button(true, false, false, true);
                navigation("/dashboard");
                return;
            }else if(x.status == 422){
                pop.type("close");
                Object.keys(x.data).forEach(key=>{
                    dataCast({run:"updateError", key:key, val:x.data[key]});
                });
                return;
            }
            return pop.type("error").title("Login Failed").message("Something happened on our end! Please try again later.").button(true, false);
        })
    }
    function inputData(e){
        const {value, name} = e.target;
        dataCast({run:"updateValue", key:name, val:value});
        const formData = {[name]: value};
        
        ApiVerifySignUp(name, formData).then(x=>{
            if(x.status == 200){
                dataCast({run:"updateError", key:name, val:""});
            }else if(x.status == 422){
                dataCast({run:"updateError", key:name, val:x.data[name]});
            }
        })
    }

    
    return <form onSubmit={submitData}>
        <div className="mb-2">
            <label>Enter your Username</label>
            <input type="text" name="username" className="my-field w-full" value={data.username.value} onInput={inputData}  placeholder="userSampl52" />
            <small className=" my-error-text">{data.username.error}</small>
        </div>

        <div className="mt-10 flex justify-center gap-2">
            <button type="submit" className="my-main-btn-big">Okay</button>
            <button type="button" className="my-main-btn-outline-big" onClick={()=>{
                const pop = new Pop(gConfig, gConfigCast);
                pop.type('info').title("Skip for now?").message("You can still modify it later on your profile. Are you sure?").callback(close=>{
                    navigation('/dashboard');
                    return close();
                });
            }}>Skip</button>
        </div>
    </form>
}