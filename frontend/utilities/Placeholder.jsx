import { useContext } from "react";
import { adjustDecimal } from "../helper/Math";
import { GlobalConfig, GlobalConfigContext } from "./GlobalConfig";

export function NotFoundPage(){
    return <>
        404 Not Found
    </>
}

export function LoadingPage(props){
    const title = props.title ?? "Page Loading"
    return <div className="py-5 flex justify-center items-center gap-2">
        <h4 className=" text-xl font-bold">
            {title}
        </h4>
        <div className="w-8 h-8">
            <svg className="animate-spin bg-my-light" width='100%' height='100%' viewBox="0 0 24 24">
                <circle className="opacity-100 stroke-amber-400 fill-none" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <circle className="opacity-50 stroke-amber-400 fill-transparent" cx="12" cy="12" r="10" strokeWidth="1"></circle>
                <path className="opacity-100 fill-yellow-200" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
</div>
}

export function LoadingTopBar (props){
    const percent = (props.percent && adjustDecimal(props.percent)) * 100 + "%" || "100%";
    const shadow = "0px 4px 7px -2px rgba(179,151,19,0.66)";
    return <div className=" absolute top-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 z-10" style={{width: percent, boxShadow: shadow}}></div>
}
 
export function LoadingTopBarWrapper(){
    const [gConfig, gConfigCast] = useContext(GlobalConfigContext);

    if(gConfig.pageLoadingPercent !== false){
        return <LoadingTopBar percent={1} />
    }
    return <></>;
}