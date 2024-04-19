import { createContext, useReducer } from "react"
import { popStructure, popUpdater } from "./Pop";


function dispatcher(state, action){
    const refState = {...state};

    if(action.run !== undefined){
        switch(action.run){
            case "updatePageLoadingPercent":
                refState.pageLoadingPercent = action.val;
            break;
        }
        
    }
    
    refState.popUp = popUpdater(action, refState.popUp);


    if(action.sideNav !== undefined){
        switch(action.sideNav){
            case "open":
                refState.sideNavisOpen = true;
            break;
            case "close":
                refState.sideNavisOpen = false;
            break;
            case "update":
                refState.sideNavSelected = action.val;
            break;
        }
    }
    
    return refState;
}

const state = {
    pageLoadingPercent: false,
    sideNavisOpen: false,
    sideNavSelected: "financialReport",
    popUp: popStructure,
}

export const GlobalConfig = ()=>{
    const [gConfig, gConfigCast] = useReducer(dispatcher, state);
    return [gConfig, gConfigCast];
}
export const GlobalConfigContext = createContext();