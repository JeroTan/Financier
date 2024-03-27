import React from "react";
import "./App.css";
import Routing from "./gatekeeper/Routing";
import { GlobalConfig, GlobalConfigContext } from "./utilities/GlobalConfig";
import { LoadingTopBarWrapper } from "./utilities/Placeholder";

export default ()=>{
    return <React.StrictMode>
        <GlobalConfigContext.Provider value={GlobalConfig()}>
            <LoadingTopBarWrapper/>
            <Routing />
        </GlobalConfigContext.Provider>
    </React.StrictMode>
}