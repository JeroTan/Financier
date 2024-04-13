import { useContext, useEffect, useMemo, useReducer, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { CurveEdgeContent, DashboardTitle, DropDown, RoundedContent } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiGetFinance } from "../../helper/API";
import { ceilDecimal, removeDecimal, toISODateFormat } from "../../helper/Math";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "financialReport"});
    }, []);

    return <main>
        <DashboardTitle title={"Financial Report"} />

        <RoundedContent>
            <h1 className=" text-yellow-500 font-semibold">Current Profile: </h1>
            <span className="text-zinc-400 font-normal">Example</span>
        </RoundedContent>

        <ListView />
        
    </main>
}

function ListView(props){
    //Configuration
    const [viewConfig, viewConfigCast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        
        if(action?.report){
            switch(action.report){
                case "change":
                    refState.report = action.val;
                break;
                case "changeFilter":
                    refState.report = action.val;
                break;
            }
        }

        if(action?.list){
            switch(action.list){
                case "change":
                    refState.list = action.val;
                break;
            }
        }

        return refState;
    }, {
        report: "Monthly", //Today, Weekly, Monthly, Annually, Decade
        filterType: "Each Day",
        list: [],
    });

    //For Filter
    function changeReport(v){
        viewConfigCast({report:"change", val:v});
    }
    function changeReportFilter(v){
        viewConfigCast({report:"changeFilter", val:v});
    }

    //For Fetch List
    function changeList(v){
        viewConfigCast({list:"change", val:v});
    }

    return <>
        <Filter changeReportFilter={changeReportFilter} changeReport={changeReport} />
        <FetchList report={viewConfig.report} reportFilter={viewConfig.reportFilter} changeList={changeList} />
    </>
}

function FetchDateRange(props){

}

function FetchList(props){
    const report = props.report;
    const reportFilter = props.reportFilter;
    const changeList = props.changeList;

    //FetchOnceOrDependciesChanged
    useEffect(()=>{
        ApiGetFinance( new Date(0), new Date(new Date().setHours(24)) ).then(x=>{
            console.log(x);
        });
    }, [report, reportFilter]);

    return "";
}

function getDateNavigator(repot, numberOfJumpBack = 0){//This wil be the left side and right side just like the carousel; This will return the reference date from today;

}

function convertFilterToDate(report, filter , date = false){ //This wil be the dropdown
    //Return an array of List of time queries
    const timeQuery = [];
    const dateToday = date || (new Date());
    const originalDateCopy = new Date(dateToday.toString());
    switch(report){
        case "Today":{
            timeQuery[0] = {};
            timeQuery[0].dateFrom = toISODateFormat(dateToday);
            dateToday.setHours(0);
            dateToday.setMinutes(0);
            dateToday.setSeconds(0);
            dateToday.setMilliseconds(0);
            timeQuery[0].dateTo = toISODateFormat(dateToday);
            break;
        }
        case "Week":{
            const length = filter == "12 Hours" ? 14 : 7;
            const minutesToReduce =  filter == "12 Hours" ? 60*12 : 60*24;  //60 Minutes * n Hours;

            for(let i = 0; i < length; i++){
                const newDateQuery = {};//set the object
                newDateQuery.dateTo = toISODateFormat(dateToday);

                if(i == 0){//To reset the timer to 0;
                    dateToday.setHours(0);
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);
                    if(filter == "12 Hours" && originalDateCopy.getDate() > 12 ){
                        dateToday.setHours(12);
                    }
                }else{//Start the reduction after the first round;
                    dateToday.setMinutes(-minutesToReduce); 
                }

                newDateQuery.dateFrom = toISODateFormat(dateToday);   
                timeQuery[i] = newDateQuery;

            }
            break;
        } 
        case "Month":{
            const length = filter == "Days" ? dateToday.getDate() : ceilDecimal( dateToday.getDate()/7 );
            const hoursToReduce = filter == "Days" ? 24*1 : 24*7; //Hours * n Days;
            
            for(let i =0 ; i < length; i++){
                const newDateQuery = {}; //set the object for time query;
                newDateQuery.dateTo = toISODateFormat(dateToday);

                if(i == 0){//To reset the timer to 0;
                    dateToday.setHours(0);
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);
                    if( filter == "Weeks" && originalDateCopy.getDate()%7  ){
                        dateToday.setHours( 24*(originalDateCopy.getDate()%7)  );
                    }
                }else{
                    dateToday.setHours( -hoursToReduce);
                }

                newDateQuery.dateFrom = toISODateFormat(dateToday);
                timeQuery[i] = newDateQuery;
            }
            break;
        }   
        case "Year":{
            const translate = {
                "Months": 1,
                "2 Months": 2,
                "3 Months": 3,
                "4 Months": 4,
                "6 Months": 6,
            }

            const length = ceilDecimal( originalDateCopy.getMonth() / translate[filter] );
            const monthToSkip = translate[filter];
            const firstTurnSkip = removeDecimal( originalDateCopy.getMonth() % translate[filter] );

            for(let i =0 ; i < length; i++){
                const newDateQuery = {}; //set the object for time query;
                newDateQuery.dateTo = toISODateFormat(dateToday);

                if(i == 0){
                    dateToday.setHours(0);
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);
                    for(let j = 0; j < firstTurnSkip; j++){
                        if(j = 0){
                            dateToday.setDate(1);
                            continue;
                        }
                        dateToday.setDate(0);
                        dateToday.setDate(1);
                    }
                }else{
                    for(let j = 0; j < monthToSkip; j++){
                        dateToday.setDate(0);
                        dateToday.setDate(1);
                    }
                }

                newDateQuery.dateFrom = toISODateFormat(dateToday);
                timeQuery[i] = newDateQuery;
            }

            break;
        }
        case "Decade":{ //10 Years
            const translate = {
                "Years": 1,
                "2 Years": 2,
                "5 Years": 5,
            }
            const length = ceilDecimal( 10 / translate[filter] );
            const yearsToSkip = translate[filter];

            for(let i =0 ; i < length; i++){
                const newDateQuery = {}; //set the object for time query;
                newDateQuery.dateTo = toISODateFormat(dateToday);

                if(i == 0){
                    dateToday.setDate(1);
                    dateToday.setHours(0);
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);   
                }
                for(let j = 0; j < yearsToSkip; j++){
                    if(i == 0 && j==0){//First Turn Skip
                        dateToday.setMonth(0);
                        continue;
                    }
                    dateToday.setMonth(-1);
                    dateToday.setMonth(0);
                }

                newDateQuery.dateFrom = toISODateFormat(dateToday);
                timeQuery[i] = newDateQuery;
            }
            break;
        }
    }
    return timeQuery;

}


function Filter(props){
    //Global
    const changeReport = props.changeReport;
    const changeReportFilter = props.changeReportFilter;


    const reportTypes = useMemo(()=>({
        Daily: ["Each"],
        Weekly: ["12 Hours", "Days"],
        Monthly: ["Days", "Weeks"],
        Anually: ["Months", "2 Months", "3 Months", "4 Months", "6 Months"],
        Decade: ["Years", "2 Years", "5 Years"],
    }), []);

    //State
    const [ getReport, setReport ] = useState("Monthly"); //Default Data must match reportTypes and getReport
    const [ getReportFilter, setReportFilter] = useState("Days"); //Default Data must match reportTypes and getReport
    const [ openReportDropdown, setOpenReportDropdown] = useState(false);
    const [ openFilterDropdown, setOpenFilterDropdown] = useState(false);

    useEffect(()=>{
        changeReport(getReport);
    }, [getReport]);

    useEffect(()=>{
        changeReportFilter(getReportFilter);
    }, [getReportFilter]);


    return <>
        <div className="flex flex-wrap justify-between mt-5 gap-1">
            <div className="relative">
                <RoundedContent className="  hover:bg-zinc-700 hover:shadow cursor-pointer " onClick={()=>setOpenReportDropdown(true)}>
                    <span className=" text-3xl font-bold">{getReport}</span>
                    <Icon name="upDown" inClass=" fill-zinc-400" outClass=" w-5 h-5" />
                </RoundedContent>
                <DropDown data={Object.keys(reportTypes)} active={openReportDropdown} selection={(data)=>{
                    setOpenReportDropdown(false);

                    if(getReport == data)
                        return;
                    
                    setReport(data);
                    setReportFilter(reportTypes[data][0]);
                    
                }} />
            </div>
            

            <div className="relative">
                <CurveEdgeContent className="  hover:bg-zinc-700 cursor-pointer "  onClick={()=>setOpenFilterDropdown(true)}>
                    <span className="text-xl font-light">{getReportFilter}</span>
                    <Icon name="filter" inClass={" fill-zinc-300"} outClass=" w-5 h-5"/>
                </CurveEdgeContent>
                <DropDown data={ reportTypes[getReport] } active={openFilterDropdown} selection={(data)=>{
                    setOpenFilterDropdown(false);

                    if(getReportFilter == data)
                        return;
                    
                    setReportFilter(data);
                }} />
            </div>
        </div>

    </>
}

function Lister(props){
    return <>
    </>
}

function LoadMore(props){
    return <>
    </>
}



