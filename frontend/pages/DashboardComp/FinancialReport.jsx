import { useContext, useEffect } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "financialReport"});
    }, []);

    return <main>
        dfd
    </main>
}