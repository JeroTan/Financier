import { createContext, useCallback, useMemo, useReducer } from "react"

export const GlobalConfig = ()=>{
    const [gConfig, gConfigCast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "updatePageLoadingPercent":
                refState.pageLoadingPercent = action.val;
            break;
        }
        return refState;
    }, {
        pageLoadingPercent: false,
    });

    return [gConfig, gConfigCast];
}
export const GlobalConfigContext = createContext();