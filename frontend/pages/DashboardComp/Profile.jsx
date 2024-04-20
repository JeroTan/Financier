import { useContext, useEffect } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { DashboardTitle } from "../Dashboard";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "profile"});
    }, []);

    return <main>
        <DashboardTitle title={"Profile"} />
    </main>
}