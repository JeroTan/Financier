import { useContext, useEffect, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { DashboardTitle } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiChangePassword, ApiSetupUsername, ApiUsername } from "../../helper/API";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "profile"});
    }, []);

    return <main>
        <DashboardTitle title={"Profile"} />
        <Viewer />
    </main>
}

function Viewer(){
    return <>
        <Profile />
    </>
}

function Profile(){

    //Use State
    const [username, setUsername] = useState(". . .");
    const [editUsername, setEditUsername] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    
    const [password, setPassword] = useState({
        old:"",
        new:"",
        confirm:"",
    });
    const [ errorPassword, setErrorPassword] = useState({
        old:"",
        new:"",
        confirm:"",
    })
    const [ editPassword, setEditPassword ] = useState(false);

    useEffect(()=>{
        getUsername();
    }, []);
    

    //Function
    function getUsername(){
        setUsername(". . .");
        ApiUsername().then(x=>{
            setUsername(x.data);
        });
    }
    function changePassword(e){
        const {value, name} = e.target;
        setPassword(prev=>{
            const refPrev = structuredClone(prev);
            prev[name] = value;
            return refPrev;
        });
        setErrorPassword(prev=>{
            const refPrev = structuredClone(prev);
            prev[name]= "";
            return refPrev;
        })
    }

    return <>
        <div className=" p-2 bg-zinc-900/50 rounded">
            {editUsername? <>
                <div>
                    <input className=" my-field w-64" value={username} placeholder="username" onInput={(e)=>{
                        setUsername(e.target.value);
                        setUsernameError("");
                    }} />
                    <small className=" my-error-text block">{usernameError}</small>
                    <div className="flex justify-end gap-1 w-64">
                        <small className=" text-yellow-600 cursor-pointer" onClick={()=>{
                            ApiSetupUsername({username:username}).then(({status, data})=>{
                                if(status == 422){
                                    setUsernameError(data);
                                    return;
                                }else if(status == 200){
                                    getUsername();
                                    setEditUsername(false);
                                }

                            })
                        }}>save</small>
                        <small className=" text-zinc-400 cursor-pointer" onClick={()=>{
                            getUsername();
                            setUsernameError("");
                            setEditUsername(false);
                        }}>cancel</small>
                    </div>
                </div>
            </>:<>
                <div className=" flex flex-wrap gap-2">
                    <h1 className=" md:text-6xl text-xl">{username}</h1>
                    <button className=" p-1 rounded bg-zinc-700 hover:bg-zinc-900 self-end " onClick={()=>setEditUsername(true)}>
                        <Icon name="edit" inClass=" fill-zinc-400" outClass="h-5 w-5" />
                    </button>
                </div>
            </>}
            
            
            <small className=" text-zinc-600">Username</small>

            <div className="mt-5"></div>
            
            <div className=" flex gap-2 flex-wrap">
                <div className=" text-zinc-400">Password</div>
                {editPassword ? <>
                    <div className="w-full flex flex-col">
                        <label>Current</label>
                        <input type="password" className=" my-field w-64" value={password.old} name="old" placeholder="Your Current Password" onInput={changePassword} />
                        <small className=" my-error-text block">{errorPassword.old}</small>
                        <label>New</label>
                        <input type="password" className=" my-field w-64" value={password.new} name="new" placeholder="New Password" onInput={changePassword} />
                        <small className=" my-error-text block">{errorPassword.new}</small>
                        <label>Confirm</label>
                        <input type="password" className=" my-field w-64" value={password.confirm} name="confirm" placeholder="Confirm your New Password" onInput={changePassword} />
                        <small className=" my-error-text block">{errorPassword.confirm}</small>
                        <div className="flex justify-end gap-1 w-64">
                            <small className=" text-yellow-600 cursor-pointer" onClick={()=>{
                               ApiChangePassword(password).then(({status, data})=>{
                                    if(status == 422){
                                        setErrorPassword(prev=>{
                                            prev.old = "";
                                            prev.new = "";
                                            prev.confirm = "";
                                            return {...prev, ...data};
                                        })
                                    }else if(status == 200){
                                        setPassword(prev=>{
                                            prev.old = "";
                                            prev.new = "";
                                            prev.confirm = "";
                                            return prev;
                                        })
                                        setErrorPassword(prev=>{
                                            prev.old = "";
                                            prev.new = "";
                                            prev.confirm = "";
                                            return prev;
                                        })
                                        setEditPassword(false);
                                    }
                               });
                            }}>save</small>
                            <small className=" text-zinc-400 cursor-pointer" onClick={()=>{
                                setPassword(prev=>{
                                    prev.old = "";
                                    prev.new = "";
                                    prev.confirm = "";
                                    return prev;
                                })
                                setErrorPassword(prev=>{
                                    prev.old = "";
                                    prev.new = "";
                                    prev.confirm = "";
                                    return prev;
                                })
                                setEditPassword(false);
                            }}>cancel</small>
                        </div>
                    </div>
                </> : <>
                    <button className=" p-1 rounded bg-zinc-700 hover:bg-zinc-900 self-end " onClick={()=>setEditPassword(true)}>
                        <Icon name="edit" inClass=" fill-zinc-400" outClass="h-5 w-5" />
                    </button>
                </>}
                
            </div>
            
        </div>
    </>
}