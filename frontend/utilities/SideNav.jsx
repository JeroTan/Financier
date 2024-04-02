import { useCallback, useContext, useMemo, useRef } from "react"
import { GlobalConfigContext } from "./GlobalConfig"
import Icon from "./Icon";
import { useNavigate } from "react-router-dom";

export function SideNav(){
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);
    const {sideNavisOpen} = gConfig;
    

    //REF
    const mainRef = useRef();

    return  sideNavisOpen ? <>
    <div ref={mainRef} className=" fixed h-screen w-full my-backdrop " onClick={(e)=>{
        if(mainRef.current !== e.target)
            return;
        gConfigCast({sideNav: "close"});
    }}>
        <div  className={`absolute left-0 top-0 bottom-0 w-96 bg-zinc-800/75 a-left-to-right sm:p-4 p-2 `}>

           <div className="flex justify-end mb-2">
                <div className=" cursor-pointer" onClick={()=>{
                    gConfigCast({sideNav: "close"});
                }}>
                    <Icon name="collapseLeft" inClass="fill-yellow-500" outClass="w-7 h-7"/>
                </div>
           </div>

            <OptionSelection />
        </div>
    </div>
    </>:""
}

function OptionSelection(){
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);
    const {sideNavisOpen, sideNavSelected } = gConfig;
    const navigation = useNavigate();

    //Functionality
    const selectOption = useCallback(e=>{
        const { id } = e.target;
        gConfigCast({sideNav:"close"});
        navigation(id);
    }, []);


    return <ul className="flex flex-wrap border-t-2 border-zinc-700">
        <li id="financialReport" onClick={selectOption} className={`w-full my-1 p-2 sm:text-xl text-base cursor-pointer rounded-lg ${sideNavSelected == "financialReport" ? "my-pick":"my-not-pick"}`}>
            Financial Report
        </li>
        <li id="addFinance" onClick={selectOption} className={`w-full my-1 p-2 sm:text-xl text-base cursor-pointer rounded-lg ${sideNavSelected == "addFinance" ? "my-pick":"my-not-pick"}`}>
            Add Finance
        </li>
        <li id="consumptionSourceList" onClick={selectOption} className={`w-full my-1 p-2 sm:text-xl text-base cursor-pointer rounded-lg ${sideNavSelected == "consumptionSourceList" ? "my-pick":"my-not-pick"}`}>
            Consumption Source List
        </li>
        <li id="profitSourceList" onClick={selectOption} className={`w-full my-1 p-2 sm:text-xl text-base cursor-pointer rounded-lg ${sideNavSelected == "profitSourceList" ? "my-pick":"my-not-pick"}`}>
            Profit Source List
        </li>
        <li id="profile" onClick={selectOption} className={`w-full my-1 p-2 sm:text-xl text-base cursor-pointer rounded-lg ${sideNavSelected == "profile" ? "my-pick":"my-not-pick"}`}>
            Profile
        </li>
    </ul>
}