import { createContext, useContext, useEffect, useReducer } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { DashboardTitle } from "../Dashboard";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val:"sourceList"});
    }, []);

    return <main>
        <DashboardTitle title={"Source List"} />
        <Viewer />
    </main>
}

const ViewerContext = createContext();

function Viewer(){
    //Global Data
    const [ viewerCast, viewerSetCast ] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action?.search){
            switch(action.search){
                case "update":
                    refState.search = action.val;
                    break;
                case "clear":
                    refState.search = "";
                    break;
            }
        }

        return refState;
    }, {
        list: [],
        viewType: "wide", //wide or compact
        search: "", //
        dateBetween: false, //{from: to:}
        amountBetween: false, //{from: to:}
        financeType: false, //false means all, [ Earn, Expense ]
    });
    return <ViewerContext.Provider value={[viewerCast, viewerSetCast]}>
            
    </ViewerContext.Provider>
}

function Filter(){
    //It has Search and Date From and Date to Filter and amount filter and expense or earn selection 
    //Also You may Add List or Compact view
    //Filter should have a reset button;
    return <>
    </>
}

//vvv---------- Coverter ------------//
function convertFiltersToQuery(search, dateBetween, amountBetween, financeType){
    
}

//^^^---------- Coverter ------------//

function FetchList(){

    return
}

function Loader(){
    return <>
    </>
}

function FilterPopUp(){
    return <>
    </>
}

function Lister(){
    return <>
    </>

}

function CompactItemView(){
    return <>
    </>
}

function WideItemView(){
    return <>
    </>
}