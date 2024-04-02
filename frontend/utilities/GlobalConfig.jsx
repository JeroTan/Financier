import { createContext, useReducer } from "react"


function dispatcher(state, action){
    const refState = {...state};

    if(action.run !== undefined){
        switch(action.run){
            case "updatePageLoadingPercent":
                refState.pageLoadingPercent = action.val;
            break;
        }
        
    }
    
    if(action.pop !== undefined){
        let popUpData = { ...refState.popUp };
        switch(action.pop){
            case "open":
                popUpData.isOpen = true;
            break;
            case "close":
                popUpData.isOpen = false;
            break;
            case "update":
                Object.keys(action.val).forEach(key => {
                    popUpData[key] = action.val[key];
                });
                popUpData = {...popUpData};
            break;
        }
        refState.popUp = popUpData;
    }

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
    popUp: {
        isOpen: false,
        width: "450px",
        icon: "check",
        iconColor: "fill-green-600",
        iconAnimate: "a-fade-in-scale",
        title: "Title",
        message: "Lorem Ipsum Dfss Mfde fjdkfss DFfjdfjf fsfsdfsdf",
        acceptButton: true,
        rejectButton: true,
        acceptButtonText: "Okay",
        rejectButtonText: "Cancel",
        acceptButtonCallback: undefined,
        rejectButtonCallback: undefined,
        closeButton: true,
        closeButtonCallback: undefined,
        backdropTrigger: true,
        backdropTriggerCallback: undefined,
        customDialog: undefined,
    }
}

export const GlobalConfig = ()=>{
    const [gConfig, gConfigCast] = useReducer(dispatcher, state);
    return [gConfig, gConfigCast];
}
export const GlobalConfigContext = createContext();