import { useContext, useEffect, useMemo, useReducer, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { CurveEdgeContent, DashboardTitle, DropDown, RoundedContent } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiGetFinance } from "../../helper/API";

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
                    refState.report = action.val.replaceAll(" ", "");
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

function Filter(props){
    //Global
    const changeReport = props.changeReport;
    const changeReportFilter = props.changeReportFilter;


    const reportTypes = useMemo(()=>({
        Today: ["Each"],
        Weekly: ["12 Hours", "Each Day",],
        Monthly: ["Each Day", "7 Days"],
        Annually: ["1 Month", "2 Months", "3 Months", "4 Months", "6 Months"],
        Decade: ["1 Years", "2 Years", "5 Years"],
    }), []);

    //State
    const [ getReport, setReport ] = useState("Monthly"); //Default Data must match reportTypes and getReport
    const [ getReportFilter, setReportFilter] = useState("Each Day"); //Default Data must match reportTypes and getReport
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



