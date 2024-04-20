import { useContext, useEffect } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { DashboardTitle } from "../Dashboard";
import Icon from "../../utilities/Icon";

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

    return <>
        <div className=" p-2 bg-zinc-900/50 rounded">
            <div className=" flex flex-wrap gap-2">
                <h1 className=" md:text-6xl text-xl">Hellow</h1>
                <button className=" p-1 rounded bg-zinc-700 hover:bg-zinc-900 self-end ">
                    <Icon name="edit" inClass=" fill-zinc-400" outClass="h-5 w-5" />
                </button>
            </div>
            
            <small className=" text-zinc-600">Username</small>
        </div>
    </>
}