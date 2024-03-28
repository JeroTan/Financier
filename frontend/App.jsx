import React from "react";
import "./App.css";
import Routing from "./gatekeeper/Routing";
import { GlobalConfig, GlobalConfigContext } from "./utilities/GlobalConfig";
import { LoadingTopBarWrapper } from "./utilities/Placeholder";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default ()=>{
    return <React.StrictMode>
        <GlobalConfigContext.Provider value={GlobalConfig()}>
            <GoogleOAuthProvider clientId="10406787598-m26739mjit32isfgqn85tp5lcah1iuk3.apps.googleusercontent.com">
                <LoadingTopBarWrapper/>
                <Routing />
            </GoogleOAuthProvider>
        </GlobalConfigContext.Provider>
    </React.StrictMode>
}