import { Fragment, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { CurveEdgeContent, DashboardTitle, DropDown, RoundedContent, SmallRoundedContent } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiGetCurrency, ApiGetFinance } from "../../helper/API";
import { DateNavigator, adjustDecimal, ceilDecimal, combineNumber, removeDecimal, transformDate } from "../../helper/Math";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "financialReport"});
    }, []);

    return <main>
        <DashboardTitle title={"Financial Report"} />

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
                    refState.dateJump = 0; //reset starting point;
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
                    if(action?.index === false)
                        refState.list.push(action.val);
                    else
                        refState.list[action.index] = action.val;
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
    function changeFilterType(v){
        viewConfigCast({report:"changeFilter", val:v});
    }

    //For Fetch List
    function changeList(v){
        viewConfigCast({list:"change", val:v});
    }
    function addToList(v, i=false){
        viewConfigCast({list:"add", val:v, index:i});
    }

    //For What Time of the Date
    function changeDateJump(v){
        viewConfigCast({jump:"change", val:v});
    }
    
    return <>
        <Header />
        <Filter dateJump={viewConfig.dateJump} changeReport={changeReport} changeFilterType={changeFilterType} changeDateJump={changeDateJump} />
        <FetchList report={viewConfig.report} filterType={viewConfig.filterType} dateJump={viewConfig.dateJump} changeList={changeList} addToList={addToList} />
        <Lister list={viewConfig.list} report={viewConfig.report} />
        <NextPrev dateJump={viewConfig.dateJump} changeDateJump={changeDateJump} />
    </>
}

function Header(props){
    
    const [ netMoney, setNetMoney ] = useState(". . .");
    const [ profile, setProfile ] = useState(". . .");
    const [ currency, setCurrency ] = useState(". . .");

    useEffect(()=>{ 
        new Promise((resolve, reject)=>{//To Be Continue
            resolve({status:200, data:"Example"})
        }).then(x=>{
            if(x.status == 200){
                setProfile(x.data);
            }
        })

        new Promise((resolve, reject)=>{//To Be Continue
            resolve({status:200, data:"Peso"})
        }).then(x=>{
            if(x.status == 200){
                setCurrency(x.data);
            }
        })

        ApiGetFinance().then(x=>{
            if(x.status == 200){
                let net = 0;
               
                x.data.forEach(d=>{
                    net += combineNumber( {sign:d.amountSign, whole:d.amountWhole, decimal:d.amountDecimal}, true );
                });
                
                setNetMoney(net);
            }
        })
        
    }, []);

    

    return <>
        <div className=" flex gap-2 flex-wrap">
            <RoundedContent>
                <h1 className=" text-yellow-500 font-semibold">Current Profile: </h1>
                <span className="text-zinc-400 font-normal">{profile}</span>
            </RoundedContent>
            <RoundedContent>
                <h1 className=" text-yellow-500 font-semibold">Currency: </h1>
                <span className="text-zinc-400 font-normal">{currency}</span>
            </RoundedContent>
            <RoundedContent>
                <h1 className=" text-yellow-500 font-semibold">Net Money: </h1>
                <span className="text-zinc-400 font-normal">{netMoney}</span>
            </RoundedContent>
            
        </div>
    </>
}


function Filter(props){
    //Global
    const { 
        dateJump,
        changeReport, changeFilterType, changeDateJump 
    } = props;

    const reportTypes = useMemo(()=>({
        Daily: ["Each"],
        Weekly: ["12 Hours", "Days"],
        Monthly: ["Days", "Weeks"],
        Anually: ["Months", "2 Months", "3 Months", "4 Months", "6 Months"],
        Decades: ["Years", "2 Years", "5 Years"],
    }), []);

    //State
    const [ getReport, setReport ] = useState("Monthly"); //Default Data must match reportTypes and getReport
    const [ getFilterType, setFilterType] = useState("Days"); //Default Data must match reportTypes and getReport
    const [ openReportDropdown, setOpenReportDropdown] = useState(false);
    const [ openFilterDropdown, setOpenFilterDropdown] = useState(false);

    //Ref
    const calendar = useRef();

    useEffect(()=>{
        changeReport(getReport);
    }, [getReport]);

    useEffect(()=>{
        changeFilterType(getFilterType);
    }, [getFilterType]);


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
                    setFilterType(reportTypes[data][0]);
                    
                }} />
            </div>
            
            {/** Container of Right Side */}
            <div className=" flex flex-wrap gap-1">
                <div className="relative">
                    <CurveEdgeContent className="hover:bg-zinc-700 cursor-pointer py-2" onClick={()=>calendar.current.showPicker()}>
                        <Icon name="calendar" inClass={" fill-zinc-300"} outClass=" w-5 h-5" />
                        <input ref={calendar} type="date" className={`absolute w-0 h-0 `} 
                            value={ transformDate( getJumpToDate(getReport, dateJump), "yyyy-mm-dd") } 
                            onInput={(e)=>{
                                changeDateJump( getDateToJump( getReport, new Date(e.target.value) ) );
                            }} 
                        />
                    </CurveEdgeContent>
                </div>

                <div className="relative">
                    <CurveEdgeContent className="  hover:bg-zinc-700 cursor-pointer "  onClick={()=>setOpenFilterDropdown(true)}>
                        <span className="text-xl font-light">{getFilterType}</span>
                        <Icon name="filter" inClass={" fill-zinc-300"} outClass=" w-5 h-5"/>
                    </CurveEdgeContent>
                    <DropDown data={ reportTypes[getReport] } active={openFilterDropdown} selection={(data)=>{
                        setOpenFilterDropdown(false);

                        if(getFilterType == data)
                            return;
                        
                        setFilterType(data);
                    }} />
                </div>
            </div>
            
        </div>

    </>
}

//vvv-------------C Fetch Data -------------------//
function FetchDateJump(props){

}

function FetchList(props){
    const {
        report, filterType, dateJump,
        changeList, addToList,
    } = props;

    //FetchOnceOrDependciesChanged
    useEffect(()=>{
        const queryData = convertFilterToDate(report, filterType, getJumpToDate(report, dateJump) );

        //Reset List
        changeList([]);

        //Query Each
        for(const i in queryData){    
            ApiGetFinance({dateFrom:queryData[i].dateFrom, dateTo:queryData[i].dateTo}).then(x=>{
                if(x.status == 200){
                    const name = `${transformDate(queryData[i].dateFrom, "simple-named")} - ${transformDate(queryData[i].dateTo, "simple-named")}`;
                    const data = convertIntoList( x.data, name );
                    addToList(data, i);
                }  
            });
        }
        
    }, [report, filterType, dateJump]);

    return "";
}
//^^^-------------C Fetch Data -------------------//


//vvv-------------H Date Transformer -------------------//
function getDateToJump(report, date){//This wil be the left side and right side just like the carousel; But this is one is for converting dateto jump
    //Structure
    const today = new DateNavigator();
    if(typeof date === "string")
        date = new Date(date);
    
    if(date.getTime() < 0){
        date.setTime(0);
    }
    if(date.getTime() > today.getTime() ){
        date.setTime( today.getTime()-1 );
    }
    
    switch(report){
        case "Daily":{
            return today.gapDay(date);
        }
        case "Weekly":{
            return today.gapWeek(date);
        }
        case "Monthly":{
            return today.gapMonth(date);
        }
        case "Anually":{
            return today.gapYear(date);
        }
        case "Decades":{
            return today.gapDecade(date);
        }
    }
}

function getJumpToDate(report, jump){ //same as the above function but in reverse;
    //Structure
    const today = new DateNavigator();
    if(jump == 0) //Return the date today if it is zero already;
        return today;

    today.normalize("Hour", "max"); //Max to set the value into max form like 23:59:59:999

    switch(report){
        case "Daily":{
            today.prevDay( jump );
            break;
        }
        case "Weekly":{
            today.normalize("Week", "max");
            today.prevWeek( jump );
            break;
        }
        case "Monthly":{
            today.prevMonth( jump , "max");
            break;
        }
        case "Anually":{
            today.normalize("Month", "max");
            today.prevYear( jump );
            break;
        }
        case "Decades":{
            today.prevDecade( jump );
            break;
        }
    }
    return today;
    
}
//^^^-------------H Date Transformer -------------------//

//vvv-------------H Query Changer & List Translator -------------------//
function convertIntoList(fetchedData, name){
    const data = {
        title: name,
        totalExpense:0,
        totalEarn:0,
        listOfFrom:{earn:[], expense:[]}, //:{id, name, amount}
    }

    //Begin Convertion
    for(const e of fetchedData){
        const { id, amountSign, amountWhole, amountDecimal, amountFrom, description, time } = e;//Spread the object;

        const amount = combineNumber( {sign:amountSign, whole:amountWhole, decimal:amountDecimal}, true );//Get the amount;

        if(amount > 0){
            data.totalEarn += amount;
            data.listOfFrom.earn.push( {id:id, name:amountFrom, amount:amount} );
        }else{
            data.totalExpense += -(amount);
            data.listOfFrom.expense.push( {id:id, name:amountFrom, amount:amount} );
        }
    }

    return data;
}

function convertFilterToDate(report, filter , date = undefined){ //This wil be the dropdown
    //Return an array of List of time queries
    const dateQuery = [];
    const dateToday = new DateNavigator( date );
    const dateCopy = new Date(dateToday);
    switch(report){ 
        case "Daily":{
            const query = {};
                query.dateTo = transformDate(dateToday,"iso");
                dateToday.normalize("Hour");
                query.dateFrom = transformDate(dateToday, "iso");
            dateQuery[0] = query;
            break;
        }
        case "Weekly":{
            const whatDay = dateCopy.getDay()+1;
            const length = filter == "12 Hours" ? ( whatDay*2 - (dateCopy.getHours() > 12 ? 0 : 1) ) : whatDay;
            // const minutesToReduce =  filter == "12 Hours" ? 60*12 : 60*24;  //60 Minutes * n Hours;

            for(let i = 0; i < length; i++){
                //Fetch IntialData;
                const query = {};
                query.dateTo = transformDate(dateToday, "iso");

                //To reset the timer to 0;
                if(i == 0){
                    dateToday.normalize("Hour");
                    if(filter == "12 Hours" && !(length%2)  ){//check if there is an offset like more than 12 hours
                        dateToday.setHours(12);
                    }
                }
                //Start the reduction after the first round;
                else{
                    if(filter == "12 Hours"){
                        dateToday.prevHour(12);
                    } 
                    else{
                        dateToday.prevDay();
                    }
                }

                query.dateFrom = transformDate(dateToday, "iso");   
                dateQuery[i] = query;
            }
            break;
        } 
        case "Monthly":{
            const length = filter == "Days" ? dateCopy.getDate() : ceilDecimal( dateCopy.getDate()/7 );
            
            for(let i =0 ; i < length; i++){
                const query = {}; //set the object for time query;
                query.dateTo = transformDate(dateToday, "iso");

                if(i == 0){//To reset the timer to 0;
                    dateToday.normalize("Hour");
                    
                    if( filter == "Weeks" ){
                        dateToday.prevDay( ((dateCopy.getDate()%7 || 7)-1)  );
                    }
                }else{
                    if( filter == "Weeks")
                        dateToday.prevWeek();
                    else{
                        dateToday.prevDay();
                    }
                }

                query.dateFrom = transformDate(dateToday, "iso");
                dateQuery[i] = query;
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

            const length = ceilDecimal( (dateCopy.getMonth()+1) / translate[filter] );
            const monthToSkip = translate[filter];
            const firstTurnSkip = removeDecimal( ((dateCopy.getMonth()+1) % translate[filter]) || translate[filter] );
            

            for(let i =0 ; i < length; i++){
                const query = {}; //set the object for time query;
                query.dateTo = transformDate(dateToday, "iso");
                
                if(i == 0){
                    dateToday.normalize("Day"); //This is the first turn
                    dateToday.prevMonth( (firstTurnSkip-1) );
                }else{
                    dateToday.prevMonth( monthToSkip )
                }

                query.dateFrom = transformDate(dateToday, "iso");
                dateQuery[i] = query;
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
                const query = {}; //set the object for time query;
                query.dateTo = transformDate(dateToday, "iso");

                if(i == 0){
                    dateToday.normalize("Month");
                    dateToday.prevYear( yearsToSkip-1 );
                }else{
                    dateToday.prevYear(yearsToSkip);
                }
                query.dateFrom = transformDate(dateToday, "iso");
                dateQuery[i] = query;
            }
            break;
        }
    }
    return dateQuery;
}
//^^^-------------H Query Changer & List Translator -------------------//


function NextPrev(props){
    const { dateJump, changeDateJump } = props;

    return <>
        <nav className=" flex flex-wrap gap-2">
            <button className=" my-main-btn-big" onClick={()=>{
                changeDateJump(dateJump+1 );
            }}>
                <Icon name="prev" outClass=" w-5 h-5" inClass=" fill-zinc-900" />
            </button>
            {dateJump > 0 ? <>
                <button className=" my-main-btn-big" onClick={()=>{
                    changeDateJump(dateJump-1 );
                }}>
                    <Icon name="next" outClass=" w-5 h-5" inClass=" fill-zinc-900" />
                </button>
            </>:""}
        </nav>
    </>
}


function Lister(props){
    const {list, report} = props;

    const currencyValue = useRef(false);
    useEffect(()=>{ 
        ApiGetCurrency().then(x=>{
            if(x.status == 200){
                currencyValue.current = x.data;
                return;
            }
            currencyValue.current = 1;
        })
    }, []);

    return <>
    <main className="w-full relative flex flex-col gap-2 py-5">
        {list.length > 0  && currencyValue.current !== false? (
            list.map((x,i)=>{
                let measurement = 100;
                if(report == "Monthly")
                    measurement = 200;
                else if(report == "Anually")
                    measurement = 1000;
                else if(report == "Decades")
                    measurement = 10000;

                return <Fragment key={i} >
                    <div  className=" flex justify-center">
                        {x == undefined ? <>
                            <div className=" rounded p-4 bg-zinc-900/50" style={{flexBasis: "1000px"}}>. . .</div>  
                        </> :<>
                        <ItemDsiplayer data={x} currency={currencyValue.current} measurement={measurement} />
                        </>}
                        
                    </div>
                </Fragment>
            })
        ):<>
            <div className="flex justify-center">
                <CurveEdgeContent>
                    <h1 className="py-4 text-3xl font-light text-zinc-500 animate-pulse">
                        Fetching Data . . .
                    </h1>
                </CurveEdgeContent> 
            </div>
        </>}
    </main>
    </>
}

function ItemDsiplayer(props){
    const data = props.data;
    const currency = props.currency ?? 1;
    const {title, totalExpense, totalEarn, listOfFrom} = data;
    const measurement = props.measurement ?? 1000;
    
    if( totalEarn <= 0 && totalExpense <= 0){
        return <>
        <div className=" relative rounded p-4 bg-zinc-900/25" style={{flexBasis: "1050px"}}>
            <h1 className=" font-semibold md:text-xl sm:text-base text-xs tracking-tighter text-zinc-600">{title}</h1>
            <SmallRoundedContent>Empty</SmallRoundedContent>
        </div>
        </>
    }

    //Compute the scale of expense and earn
    const ExpenseLength = useMemo(()=>{
        return ((currency*measurement*5) < totalExpense) ? ceilDecimal( totalExpense / (currency*measurement) ) : 5 ;
    }, []);
    const EarnLength = useMemo(()=>{
        return ((currency*measurement*5) < totalEarn) ? ceilDecimal( totalEarn / (currency*measurement) ) : 5 ;
    }, []);
    
    
    //Calculate Line Measurement of Expense
    const ExpenseMeasurement = useMemo(()=>{
        return [...Array(ExpenseLength+1)].map((x, i)=>{
            return <div key={i} className=" absolute bg-zinc-400 w-1 h-3" style={{left: (100*(i/ExpenseLength))+"%",  bottom: "25%" }} ></div>
        })
    }, []);

    //Calculate Line Measurement of Earn
    const EarnMeasurement = useMemo(()=>{
        return [...Array(EarnLength+1)].map((x, i)=>{
            return <div key={i} className=" absolute bg-zinc-400 w-1 h-3" style={{right: (100*(i/EarnLength))+"%",  bottom: "25%" }} ></div>
        })
    }, []);

    //Graphs
    const ExpenseGraph = useMemo(()=>{
        return <div className=" h-5 rounded-l bg-yellow-500" style={{width: `${ totalExpense/(ExpenseLength*currency*measurement)*100 }%`}}></div>
    }, []);
    const EarnGraph = useMemo(()=>{
        return <div className=" h-5 rounded-r bg-emerald-700" style={{width: `${ totalEarn/(EarnLength*currency*measurement)*100 }%`}}></div>
    }, []);

    //useState
    const [ openListOfFrom, setOpenListOfFrom ] = useState(false);
    

    return <>
        <div className=" relative rounded p-4 mt-5 bg-zinc-900/75" style={{flexBasis: "1050px"}}>
            <h1 className=" font-semibold md:text-xl sm:text-base text-xs tracking-tighter text-zinc-400">{title}</h1>
            
            {/* Graph */}
            <div className="relative my-3 flex flex-wrap">
                <div className=" w-6/12 h-5 relative overflow-hidden">
                    <hr className=" absolute top-1/2 bottom-1/2 w-full border-zinc-500" />
                    {ExpenseMeasurement}
                </div>
                <div className=" w-6/12 h-5 relative overflow-hidden">
                    <hr className=" absolute top-1/2 bottom-1/2 w-full border-zinc-500" />
                    {EarnMeasurement}
                </div>

                <div className=" w-6/12 flex justify-end overflow-hidden">
                    {ExpenseGraph}
                </div>
                <div className=" w-6/12 flex justify-start overflow-hidden">
                    {EarnGraph}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex flex-col">
                    <small className=" text-zinc-400">Expenses: <span className=" text-zinc-300 font-bold">{totalExpense}</span></small>
                    <small className=" text-zinc-400">Earnings: <span className=" text-zinc-300 font-bold">{totalEarn}</span></small>
                </div>
                <div className=" basis-96 bg-zinc-700/50 rounded overflow-hidden">
                    <div className={`w-full cursor-pointer p-2 rounded flex justify-between items-center ${openListOfFrom ? "bg-zinc-800 hover:bg-zinc-800/50":"bg-zinc-800/75 hover:bg-zinc-700"} `} onClick={()=>setOpenListOfFrom(prev=>!prev)}>
                        <p className=" tracking-tighter font-semibold text-zinc-400">Transactions</p>
                        <Icon name={openListOfFrom?"up":"down"} inClass=" fill-zinc-400" outClass=" w-5 h-5" />
                    </div>

                    {openListOfFrom ?<>
                    <div className="p-2">
                        <h4>Expense: </h4>
                        <DisplayListFrom list={listOfFrom.expense} total={totalExpense} />

                        <h4>Earn: </h4>
                        <DisplayListFrom list={listOfFrom.earn} total={totalEarn} />

                    </div>
                    </>:""}

                </div>
            </div>
            
        </div>  
    </>
}

function DisplayListFrom(props){
    const { list, total } = props;

    if(list.length < 1){ //return and skip other logic if the list is actually empty;
        return <SmallRoundedContent>Empty</SmallRoundedContent>
    }

    //Make A Controllable Reference of List
    const referenceList = useRef(list);

    const [ loadCount, setLoadCount ] = useState(0);
    const [ refinedList, setRefinedList ] = useState([]); //This one is different from controllable
    const originalLength = list.length;
    const loadThreshold = 10;

    useEffect(()=>{
        let i = 0; //Use to break stuff once reache the threshold
        for(const e of referenceList.current){
            if(i==loadThreshold)
                break;
            
            setRefinedList(prev=>{
                const refPrev = structuredClone(prev)
                refPrev.push( e );
                return refPrev;
            })
            
            i++;
        }
        
        referenceList.current = referenceList.current.filter((x,i)=>i<loadThreshold?false:true);
    }, [ loadCount ]);

    return <>
        {refinedList.map(x=>{
            return <Fragment key={x.id}>
                <div className="ml-2 w-100 flex flex-wrap justify-between gap-2">
                    <small className=" me-auto text-zinc-400">{x.name}</small>
                    <small className="text-zinc-400"> {x.amount} </small>
                    <small className="text-yellow-400/50 italic">{ adjustDecimal(Number(Math.abs(x.amount))/total*100) }%</small>
                </div>
            </Fragment>
        })}
        {loadCount < removeDecimal((originalLength-1)/loadThreshold) ? <>
            <SmallRoundedContent className="cursor-pointer hover:bg-zinc-800" onClick={()=>{setLoadCount(prev=>prev+1)}}>Load More</SmallRoundedContent>
        </> : ""}
    </>
}


//IF I have time I will add this
function LoadMore(props){
    return <>
    </>
}



