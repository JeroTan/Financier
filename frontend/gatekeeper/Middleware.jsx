


/*
If you need to replace the current location instead of push a new one onto the history stack, use navigate(to, { replace: true })
<Navigate to="/home" replace state={state} />;
<Navigate to="about" replace />
<Navigate to="home" />
return <Navigate to="/home" replace state={state} />; the state is the props that will be passed

navigate(-2) or + to go back or next in link page history

navigate(`${newRecord.id}`); means the current page or routes but changes only it's relative /



*/

import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingPage } from "../utilities/Placeholder";
import { GlobalConfigContext } from "../utilities/GlobalConfig";
import PagePlate from "../utilities/PagePlate";


export default (props)=>{
    //Global
    const [gConfig, gConfigCast] = useContext(GlobalConfigContext);
    const location = useLocation();

    //Structure
    const element = props.element;
    const guards = useMemo(()=>{
        let guards = props.guards ?? [];

        if(typeof(guards) === "string"){
            guards = (guards).split("|");
        };
        guards = guards.map(e => {
            let eName = "";
            let eVal = [];
            
            if(typeof(e) === "string"){
                const stringParse = e.split(":");
                eName = stringParse[0];
                if(stringParse.length == 2){
                    eVal = stringParse[1];
                    if(!Array.isArray(eVal.length) && typeof(eVal) === "string"){
                        eVal = stringParse[1].split(",");
                    }
                }
            }

            return {name: eName, val: eVal};
        });
        
        return guards;
    }, []);
    const [result, resultSet] = useState(false);
    const helpers = useMemo(()=>({
        resultSet:resultSet,
        element:element,
        loadingUpdate: (x)=>gConfigCast({run:"updatePageLoadingPercent", val:x}),
    }), [location.pathname]);
    
    //Prepare the Middleware
    useEffect(()=>{
        resultSet(false);
        helpers.loadingUpdate(0);
        guardChecking(guards, helpers); 
        helpers.loadingUpdate(false);
    }, [location.pathname]);


    //Show the result of middleware and not if it is still processing.
    if(result === false){
        return <PagePlate  clean={true}>
            <LoadingPage />
        </PagePlate>
    }else{
        return result;
    }
} 



function guardChecking(guards, helpers, i=0){
    if(!guards[i]){ //Check if the guards run out of specified elements
        helpers.resultSet(helpers.element); //when you reach the last element and there is no false return the element
        helpers.loadingUpdate(false);
        return;
    }

    helpers.loadingUpdate((i+1)/guards.length);
    if( Array.isArray(guardActions[guards[i].name]) ){//Check if function from guardAction Object is existed.
        guardChecking(guards, helpers, i+1);
        return;
    }
    
    guardActions[guards[i].name](helpers, guards[i].val).then(x=>{
    
        if(x === true){//Check the next one if failed
            guardChecking(guards, helpers, i+1);
        }else{
            helpers.resultSet(x); //Change the result depending on error fallbackcomponent
        }

    });
}

//Insert Middleware Function here
const guardActions = {//Return a component of wrong or invalid
    loginRequired: async (helper= false, val=false)=>{
        return new Promise(resolve=>resolve(true)) //return to continue checking
    },
    mustNotLogin: async (helper= false, val=false)=>{
        return new Promise(resolve=>resolve(true));
    },
};