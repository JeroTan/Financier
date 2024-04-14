import { useContext, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { CurveEdgeContent, DashboardTitle, DropDown, RoundedContent } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiGetFinance } from "../../helper/API";
import { ceilDecimal, removeDecimal, toISODateFormat, transformDate } from "../../helper/Math";

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
                    refState.dateRange = 0; //reset starting point;
                break;
                case "changeFilter":
                    refState.filterType = action.val;
                break;
            }
        }

        if(action?.list){
            switch(action.list){
                case "change":
                    refState.list = action.val;
                break;
                case "add":
                    refState.list.push(action.val);
                break;
            }
        }

        if(action?.jump){
            switch(action.jump){
                case "change":
                    refState.dateJump = action.val;
                break;
            }
        }

        return refState;
    }, {
        report: "Monthly", //Today, Weekly, Monthly, Annually, Decade
        filterType: "Days",
        list: [],
        dateJump: 0, //Starting Point
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
    function addToList(v){
        viewConfigCast({list:"add", val:v});
    }

    //For What Time of the Date
    function changeJumpDate(v){
        viewConfigCast({jump:"change", val:v});
    }

    return <>
        <Filter changeReportFilter={changeReportFilter} changeReport={changeReport} dateJump={viewConfig.dateJump} changeJumpDate={changeJumpDate} />
        <FetchList report={viewConfig.report} filterType={viewConfig.filterType} dateJump={viewConfig.dateJump} changeList={changeList} addToList={addToList} />
    </>
}

function Filter(props){
    //Global
    const changeReport = props.changeReport;
    const changeReportFilter = props.changeReportFilter;
    const dateJump = props.dateJump;
    const changeJumpDate = props.changeJumpDate;


    const reportTypes = useMemo(()=>({
        Daily: ["Each"],
        Weekly: ["12 Hours", "Days"],
        Monthly: ["Days", "Weeks"],
        Anually: ["Months", "2 Months", "3 Months", "4 Months", "6 Months"],
        Decades: ["Years", "2 Years", "5 Years"],
    }), []);

    //State
    const [ getReport, setReport ] = useState("Monthly"); //Default Data must match reportTypes and getReport
    const [ getReportFilter, setReportFilter] = useState("Days"); //Default Data must match reportTypes and getReport
    const [ openReportDropdown, setOpenReportDropdown] = useState(false);
    const [ openFilterDropdown, setOpenFilterDropdown] = useState(false);

    //Ref
    const calendar = useRef();

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
            
            {/** Container of Right Side */}
            <div className=" flex flex-wrap gap-1">
                <div className="relative">
                    <CurveEdgeContent className="hover:bg-zinc-700 cursor-pointer py-2" onClick={()=>calendar.current.showPicker()}>
                        <Icon name="calendar" inClass={" fill-zinc-300"} outClass=" w-5 h-5" />
                        <input ref={calendar} type="date" className={`absolute w-0 h-0 `} value={ transformDate(getJumpToDate(getReport, dateJump), "yyyy-mm-dd") } onInput={(e)=>{
                            e.preventDefault();
                            changeJumpDate( getDateToJump( getReport, new Date(e.target.value) ) );
                        }} />
                    </CurveEdgeContent>
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
            
        </div>

    </>
}

function FetchDateJump(props){

}

function FetchList(props){
    const {
        report,
        filterType,
        changeList,
        addToList,
        dateJump
    } = props;

    //FetchOnceOrDependciesChanged
    useEffect(()=>{
        const queryData = convertFilterToDate(report, filterType);
        
        //Query Each
        for(const e of queryData){
            
            ApiGetFinance(e.dateFrom, e.dateTo).then(x=>{
                
            });
        }
        
    }, [report, filterType]);

    return "";
}


//vvv------------- Date Transformer -------------------//
function getDateToJump(report, date){//This wil be the left side and right side just like the carousel; But this is one is for converting dateto jump
    //Structure
    const second = 1000; //1000 milliseconds == 1 second;
    const minute = 60 * second; 
    const hour = 60 * minute;
    const day = 24 * hour;
    const today = new Date();
    
    if(typeof date === "string"){
        date = new Date(date);
    }
    if(date.getTime() <= 0){
        date.setTime(0);
    }
    if(date.getTime() > today.getTime() ){
        date.setTime( today.getTime()-1 );
    }
    
    
    
    let annualGap = today.getFullYear() - date.getFullYear();
    let monthGap = today.getMonth() - date.getMonth();
    switch(report){
        case "Daily":{
            const dailyGap = today.getTime() - date.getTime();
            return removeDecimal((dailyGap/day));
        }
        case "Weekly":{
            today.setTime( today.getTime() + ( day*(6-(today.getDay())) ) ); //offsetThe Week;
            const weekGap = today.getTime() - date.getTime();
            return removeDecimal((weekGap/(7*day)));
        }
        case "Monthly":{
            (()=>{//Do a substraction for annual and monthgap
                if(monthGap < 0){
                    annualGap-=1;
                    monthGap+=12;
                }
            })();
            return (annualGap*12) + monthGap;
        }
        case "Anually":{
            return annualGap;
            break;
        }
        case "Decades":{
            return removeDecimal(annualGap/10);
        }
    }
}

function getJumpToDate(report, jump){ //same as the above function but in reverse;
    //Structure
    const second = 1000; //1000 milliseconds == 1 second;
    const minute = 60 * second; 
    const hour = 60 * minute;
    const day = 24 * hour;
    const today = new Date();
    if(jump == 0) //Return the date today if it is zero already;
        return today;

    //Just use subtraction on daily and weekly
    //in months use skippers setDate(0);
    //set the Date to 1 first then  in years use setMonth(-1); Then set to 31 and set hour to 23 minutes to 59 seconds to 59
    // same with year but skip by 10;
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    today.setMilliseconds(99);
    switch(report){
        case "Daily":{
            today.setTime(today.getTime() - day*jump);
            break;
        }
        case "Weekly":{
            today.setTime( today.getTime() + ( day*(6-(today.getDay())) ) ); //Set the ending saturday.
            today.setTime( today.getTime() - day*7*jump ); //then begin the move back here;
            break;
        }
        case "Monthly":{
            while(jump > 0){
                today.setDate(0);
                --jump;
            }
            break;
        }
        case "Anually":{
            today.setMonth(11); //Put the month and day to december 31
            today.setDate(31);
            while(jump > 0){
                today.setMonth(-1);
                --jump;
            }
            break;
        }
        case "Decades":{
            today.setMonth(11); //Put the month and day to december 31
            today.setDate(31);
            while(jump > 0){
                today.setFullYear( today.getFullYear() - 10 );
                --jump;
            }
            break;
        }
    }
    return today;
    
}
//^^^------------- Date Transformer -------------------//

//vvv------------- Query Changer & List Translator -------------------//
function convertIntoList(){
    
}

function convertFilterToDate(report, filter , date = false){ //This wil be the dropdown
    //Return an array of List of time queries
    const timeQuery = [];
    const dateToday = date || (new Date());
    const originalDateCopy = new Date(dateToday.toString());
    switch(report){ 
        case "Daily":{
            timeQuery[0] = {};
            timeQuery[0].dateFrom = toISODateFormat(dateToday);
            dateToday.setHours(0);
            dateToday.setMinutes(0);
            dateToday.setSeconds(0);
            dateToday.setMilliseconds(0);
            timeQuery[0].dateTo = toISODateFormat(dateToday);
            break;
        }
        case "Weekly":{
            const whatDay = originalDateCopy.getDay()+1;
            const length = filter == "12 Hours" ? ( (whatDay)*2 - (originalDateCopy.getHours() > 12 ? 0 : 1) ) : whatDay;
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
        case "Monthly":{
            const length = filter == "Days" ? dateToday.getDate() : ceilDecimal( dateToday.getDate()/7 );
            const hoursToReduce = filter == "Days" ? 24*1 : 24*7; //Hours * n Days;
            
            for(let i =0 ; i < length; i++){
                const newDateQuery = {}; //set the object for time query;
                newDateQuery.dateTo = toISODateFormat(dateToday);

                if(i == 0){//To reset the timer to 0;
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);
                    if( filter == "Weeks" ){
                        const skip = (originalDateCopy.getDate()%7)-1;
                        dateToday.setHours( -24*(skip > -1 ? skip : 6) );
                    }else{
                        dateToday.setHours(0);
                    }
                }else{
                    dateToday.setHours( -hoursToReduce);
                }

                newDateQuery.dateFrom = toISODateFormat(dateToday);
                timeQuery[i] = newDateQuery;
            }
            break;
        }   
        case "Anually":{
            const translate = {
                "Months": 1,
                "2 Months": 2,
                "3 Months": 3,
                "4 Months": 4,
                "6 Months": 6,
            }

            const length = ceilDecimal( (originalDateCopy.getMonth()+1) / translate[filter] );
            const monthToSkip = translate[filter];
            const firstTurnSkip = removeDecimal( ((originalDateCopy.getMonth()+1) % translate[filter]) || translate[filter] );
            
            
            for(let i =0 ; i < length; i++){
                const newDateQuery = {}; //set the object for time query;
                newDateQuery.dateTo = toISODateFormat(dateToday);
                
                if(i == 0){
                    dateToday.setHours(0);
                    dateToday.setMinutes(0);
                    dateToday.setSeconds(0);
                    dateToday.setMilliseconds(0);
                    for(let j = 0; j < firstTurnSkip; j++){
                        if(j == 0){
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
        case "Decades":{ //10 Years
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
//^^^------------- Query Changer & List Translator -------------------//




function Lister(props){
    return <>
    </>
}

function LoadMore(props){
    return <>
    </>
}



