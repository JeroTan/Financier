import { Fragment, createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { CurveEdgeContent, DashboardTitle, RoundedContent, SmallRoundedContentGreen, SmallRoundedContentYellow } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { Pop } from "../../utilities/Pop";
import { ApiDeleteFinance, ApiGetFinance, Fetcher } from "../../helper/API";
import { combineNumber } from "../../helper/Math";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiate
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

        switch(action?.search){
            case "update":
                refState.search = action.val;
            break;
            case "clear":
                refState.search = "";
            break;
        }

        switch(action?.view){
            case "toggle":
                refState.view = refState.view == "compact" ? "wide" : "compact";
            break;
        }

        switch(action?.type){
            case "update":
                refState.type = action.val;
            break;
        }

        switch(action?.amount){
            case "update_from":
                refState.amountBetween.from = action.val;
            break;
            case "update_to":
                refState.amountBetween.to = action.val;
            break;
        }

        switch(action?.date){
            case "update_from":
                refState.dateBetween.from = action.val;
            break;
            case "update_to":
                refState.dateBetween.to = action.val;
            break;
        }

        switch(action?.filter){
            case "reset":
                refState.dateBetween.from = "";
                refState.dateBetween.to = "";
                refState.amountBetween.from = "";
                refState.amountBetween.to = "";
                refState.type = "all";
            break;
        }

        switch(action?.sortName){
            case "toggle":
                refState.sortName = refState.sortName == "asc" ? "desc" : "asc";
            break;
        }

        switch(action?.sortAmount){
            case "toggle":
                refState.sortAmount = refState.sortAmount == "asc" ? "desc" : "asc";
            break;
        }

        switch(action?.list){
            case "update":
                refState.list = action.val;
            break;
            case "add":
                refState.list = [...refState.list, ...action.val];
            break;
            case "reset":
                refState.list = [];
            break;
        }

        switch(action?.load){
            case "next":
                refState.load+=1;
            break;
            case "reset":
                refState.load = 0;
            break;
            case "yesNext":
                refState.loadNext = true;
            break;
            case "noNext":
                refState.loadNext = false;
            break;
        }

        switch(action?.refresh){
            case "start":
                refState.refresh = true;
            break;
            case "stop":
                refState.refresh = false;
            break;
        }

        if(typeof action?.fetching === "boolean"){
            refState.fetching = action.fetching;
        }
        

        return refState;
    }, {
        list: [],
        view: "compact", //wide or compact
        search: "", //
        dateBetween: {from:"", to:""}, //{from: to:}
        amountBetween: {from:"", to:""}, //{from: to:}
        type: "all", //all, earn, expense 
        sortName: "asc",
        sortAmount: "asc",
        load: 1, //current number
        loadNext: false, //Check if there is a thing to load more;
        fetching: true,
        refresh: false,
    });
    return <ViewerContext.Provider value={[viewerCast, viewerSetCast]}>
        <Filter />
        <Sorter />
        <FetchList />
        <Lister />
        <Loader />
    </ViewerContext.Provider>
}

function Filter(){
    //Global
    const [ gConfigCast, gConfigSetCast ] = useContext(GlobalConfigContext);
    const [ viewerCast, viewerSetCast] = useContext(ViewerContext);
    const { view, dateBetween, amountBetween, type } = viewerCast;
    const pop = new Pop(gConfigCast, gConfigSetCast);

    //domReference
    const searchRef = useRef();

    //Functions
    function search(e){
        e.preventDefault();
        const { value } = searchRef.current;
        viewerSetCast({search:"update", val:value});
    }
    function changeView(e){
        viewerSetCast({view:"toggle"})
    }
    function selectType(e){
        const { value } = e.target;
        viewerSetCast({type:"update", val:value});
    }
    function amountChange(e){
        const { value, name } = e.target;
        viewerSetCast({amount: "update_"+name, val: value});
    }
    function dateChange(e){
        const { value, name } = e.target;
        viewerSetCast({date: "update_"+name, val: value});
    }
    function resetFilter(e){
        viewerSetCast({filter: "reset"});
    }
    
    useEffect(()=>{
        pop.custom((close)=>{
            return <>
                <h4 className=" text-yellow-500 text-lg font-semibold tracking-tight">Type:</h4>
                <div className=" flex flex-col ml-4">
                    <div>
                        <input id="all" type="radio" name="type" value="all" onChange={selectType} checked={type=="all"} />
                        <label className="ml-1 text-zinc-400">All</label>
                    </div>
                    <div>
                        <input id="earn" type="radio" name="type" value="earn" onChange={selectType} checked={type=="earn"} />
                        <label className="ml-1 text-zinc-400">Earn</label>
                    </div>
                    <div>
                        <input id="expense" type="radio" name="type" value="expense" onChange={selectType} checked={type=="expense"} />
                        <label className="ml-1 text-zinc-400" >Expense</label>
                    </div>
                </div>

                <h4 className=" text-yellow-500 text-lg font-semibold tracking-tight mt-8">Amount:</h4>
                <div className=" flex flex-wrap gap-2">
                    <div className="flex flex-col">
                        <label>From</label>
                        <input className="my-field" type="number" name="from" value={amountBetween.from} onInput={amountChange} />
                    </div>
                    <div className="flex flex-col">
                        <label>To</label>
                        <input className="my-field" type="number" name="to" value={amountBetween.to} onInput={amountChange} />
                    </div>
                </div>
                
                <h4 className=" text-yellow-500 text-lg font-semibold tracking-tight mt-8">Date:</h4>
                <div className=" flex flex-wrap gap-2">
                    <div className="flex flex-col">
                        <label>From</label>
                        <input className="my-field" type="datetime-local" name="from" value={dateBetween.from} onInput={dateChange} />
                    </div>
                    <div className="flex flex-col">
                        <label>To</label>
                        <input className="my-field" type="datetime-local" name="to" value={dateBetween.to} onInput={dateChange} />
                    </div>
                </div>
                
                <button className="bg-zinc-600 hover:bg-zinc-500 px-2 rounded mt-4" onClick={resetFilter}>Reset</button>
            </>
        });
    }, [amountBetween.to, amountBetween.from, dateBetween.to, dateBetween.from, type]);
    

    return <>
        <nav className="flex flex-wrap mt-5 gap-1">
            <form className="relative flex gap-1" onSubmit={search}>
                <RoundedContent className="hover:bg-zinc-900/25">
                    <input ref={searchRef} type="text" className=" bg-transparent my-1 focus:outline-none rounded" placeholder="Search . . ." onInput={(e)=>{
                        if(e.target.value){
                            return;
                        }
                        viewerSetCast({search:"clear"});
                    }} />
                </RoundedContent>
                <RoundedContent className="cursor-pointer hover:bg-zinc-700" onClick={search}>
                    <Icon name="search" inClass=" fill-zinc-300" outClass=" w-4 h-4" />
                </RoundedContent>
            </form>

            <div className=" ml-auto flex gap-1 flex-wrap">
                <CurveEdgeContent className=" hover:bg-zinc-700 cursor-pointer" onClick={()=>pop.open()}>
                    <Icon name="filter" inClass=" fill-zinc-300" outClass=" w-4 h-4 my-1" />
                </CurveEdgeContent>
                <CurveEdgeContent className=" hover:bg-zinc-700 cursor-pointer" onClick={changeView}>
                    <Icon name={view+"_view"} inClass=" fill-zinc-300" outClass=" w-4 h-4 my-1" />
                </CurveEdgeContent>
            </div>
        </nav>
    </>
}

function Sorter(props){
    // Global
    const [ viewerCast, viewerSetCast ] = useContext(ViewerContext);
    const {sortName, sortAmount} = viewerCast;

    function nameToggle(e){
        viewerSetCast({sortName:"toggle"});
    }

    function amountToggle(e){
        viewerSetCast({sortAmount:"toggle"});
    }

    return <>
        <main className=" flex flex-wrap justify-end gap-2 mt-5">
            <RoundedContent className="cursor-pointer hover:bg-zinc-700" onClick={nameToggle}>
                <span>Name</span>
                <Icon name={`${sortName == "asc"? "up" : "down"}`} inClass=" fill-zinc-300" outClass=" w-4 h-4"  /> 
            </RoundedContent>

            <RoundedContent className="cursor-pointer hover:bg-zinc-700" onClick={amountToggle}>
                <span>Amount</span>
                <Icon name={`${sortAmount == "asc"? "up" : "down"}`} inClass=" fill-zinc-300" outClass=" w-4 h-4"  /> 
            </RoundedContent>

        </main>
    </>
}

//vvv---------- Converter ------------//
function convertList(list){
    const newList = [];
    for(const e of list){
        const number = combineNumber({
            sign: e.amountSign,
            whole: e.amountWhole,
            decimal: e.amountDecimal,
        } , true);
        newList[newList.length] = { id: e.id, type: e.amountSign?"Expense":"Earn", amount:Math.abs(number), from:e.amountFrom, description: e.description };
    }
    return newList;
}
//^^^---------- Converter ------------//

function FetchList(){
    //Global
    const [ viewerCast, viewerSetCast ] = useContext(ViewerContext);
    const { search, dateBetween, amountBetween, type, sortName, sortAmount, load, refresh } = viewerCast;
    const limit = 25;
    const fetcher = new Fetcher(ApiGetFinance);

    //Skip The Other Stuff when first fetch happen
    const [firstTurnSkip, setFirstTurnSkip] = useState(true);

    //Data To Send
    const dataToSend = {
        //Filterers
        search: search,
        amountFrom: amountBetween.from,
        amountTo: amountBetween.to,
        dateFrom: dateBetween.from,
        dateTo: dateBetween.to,
        type:type, 
        //Sorting
        sortName:sortName, 
        sortAmount:sortAmount,
        //Pagination
        limit:limit,
        offset:limit*load,
    }

    useEffect(()=>{
        if(firstTurnSkip)
            setFirstTurnSkip(false);

        viewerSetCast({fetching:true});
        fetcher.addParam({...dataToSend, limit:limit+1, offset:0}).addTodo((status, data)=>{ // the plus is there to check if there still next data;
            if(status != 200)
                return;
            if(refresh)
                viewerSetCast({refresh:"stop"});
            viewerSetCast({fetching:false});
            viewerSetCast({load:"reset"});
            viewerSetCast({list:"update", val:convertList(data).filter((x,i)=>i<limit) }); //filter only to limit since we add 1 on fetching
            viewerSetCast({load: data.length < limit ? "noNext" : "yesNext"});
        }).fetch();

    }, [search, type, amountBetween.from, amountBetween.to, dateBetween.from, dateBetween.to, refresh]);

    //Sort Name  //// MY BIGGEST MISTAKE ORDERING SHOULD HAVE A PRIORITY
    useEffect(()=>{
        if(firstTurnSkip)
            return;

        viewerSetCast({fetching:true});
        fetcher.addParam({...dataToSend, limit:limit*(load+1)+1, offset:0, sortAmount:false}).addTodo((status, data)=>{
            if(status != 200)
                return;
            
            viewerSetCast({fetching:false});
            viewerSetCast({list:"update", val:convertList(data).filter( (x,i)=>i<(limit*(load+1)) ) }); //filter only to limit
        }).fetch();

    }, [sortName]);
    useEffect(()=>{
        if(firstTurnSkip)
            return;

        viewerSetCast({fetching:true});
        fetcher.addParam({...dataToSend, limit:limit*(load+1)+1, offset:0, sortName:false}).addTodo((status, data)=>{
            if(status != 200)
                return;
            
            viewerSetCast({fetching:false});
            viewerSetCast({list:"update", val:convertList(data).filter( (x,i)=>i<(limit*(load+1)) ) }); //filter only to limit
        }).fetch();

    }, [sortAmount]);


    useEffect(()=>{
        if(load <= 1) //Will not work if the load is equals to 1
            return;

        viewerSetCast({fetching:true});
        fetcher.addParam({...dataToSend, limit:limit+1}).addTodo((status, data)=>{
            if(status != 200)
                return;

            viewerSetCast({fetching:false});
            viewerSetCast({list:"add", val:convertList(data).filter((x,i)=>i<limit) }); //filter only to limit since we add 1 on fetching
            viewerSetCast({load: data.length < limit ? "noNext" : "yesNext"});
        }).fetch();
        
    }, [load]);

}

function Loader(){
    //Global
    const [ viewerCast, viewerSetCast ] = useContext( ViewerContext );
    const { loadNext } = viewerCast;
    if(!loadNext)
        return ""

    return <>
        <nav className=" flex justify-center my-5">
            <button className=" my-main-btn-big" onClick={()=>{
                viewerSetCast({load:"next"})
            }} >Load More</button>
        </nav>
    </>
}

function Lister(){
    //Global
    const [ viewerCast, viewerSetCast ] = useContext(ViewerContext);
    const { fetching, list, view } = viewerCast;


    return <>
    <div className="mt-4"></div>
    {!fetching ?<>
        {list && list.length > 0 ? <>
            <main className=" flex flex-wrap gap-2 justify-center">
                {list.map(x=>{
                    return <Fragment key={x.id}>
                        {view == "compact"? <>
                            <CompactItemView {...x} />
                        </>:<>
                            <WideItemView {...x} />
                        </>}
                    </Fragment>
                })}
                <div className="w-64 "></div>  
                <div className="w-64 "></div>  
                <div className="w-64 "></div>
                <div className="w-64 "></div>  
            </main>
            
        </>: <>
            <div className="flex justify-center">
                <CurveEdgeContent>
                    <h1 className="py-4 text-3xl font-light text-zinc-300">
                        This list is empty . . .
                    </h1>
                </CurveEdgeContent> 
            </div>
        </>}
    </>:<>
        <div className="flex justify-center">
            <CurveEdgeContent>
                <h1 className="py-4 text-3xl font-light text-zinc-500 animate-pulse">
                    Fetching Data . . .
                </h1>
            </CurveEdgeContent> 
        </div>
    </>}
    </>

}

function CompactItemView(props){
    //Global
    const [ gConfigCast, gConfigSetCast ] = useContext(GlobalConfigContext);
    const [ viewerCast, viewerSetCast ] = useContext(ViewerContext);

    const {id, from, type, amount, description} = props;

    const [openOption, setOpenOption] = useState(false);

    //Functions
    function deleteItem(e){
        const pop = new Pop(gConfigCast, gConfigSetCast);
        pop.type("warning").title("Deletion Warning").message(`Do you want to delete this "${from}"?`).callback((close)=>{
            pop.type("loading").message("Deleting. . .")
            ApiDeleteFinance(id).then(({status, data})=>{
                if(status == 200){
                    viewerSetCast({refresh:"start"});
                    pop.type("success").title("Success").message(`Item is deleted successfully.`);
                } 
            });
        })
    }

    return <>
        <div className="relative">
            <div className="w-64 rounded p-2 bg-zinc-900/25 hover:bg-zinc-900 group" onClick={()=>setOpenOption(prev=>!prev)}>
                <h1 className=" font-semibold">{from}</h1>
                {type=="Expense"? <>
                    <SmallRoundedContentYellow>Expense</SmallRoundedContentYellow>
                </>:<>
                    <SmallRoundedContentGreen >Earn</SmallRoundedContentGreen>
                </>}
                <div className="my-4"></div>
                <div className=" flex  gap-1 justify-end ">
                    <Icon name="cash" inClass=" fill-zinc-700" outClass=" w-5 h-5 self-start mt-[2px] shrink-0" />
                    <h1 className="text-right truncate">{amount.toLocaleString('en')} </h1>
                </div>
                <div className={`  h-0 group-hover:h-auto  mt-3 hover:transition overflow-hidden`}>
                    {description?<>
                        <h2 className="font-semibold">Description</h2>
                        <p className="text-zinc-400 ">{description}</p>
                    </> :<>
                        <h2 className=" italic text-zinc-400"> No Description. . .</h2>
                    </>}
                    
                </div>
            </div>
            {openOption ? <>
                <div className=" absolute right-0 bottom-full h-5 w-max z-10">
                    <CurveEdgeContent className=" hover:bg-zinc-700 cursor-pointer mb-1" onClick={deleteItem}>
                        <Icon name="trash" inClass=" fill-red-500" outClass=" w-5 h-5" />
                    </CurveEdgeContent>
                </div>
            </>:<>
            </>}
        </div>
        
    </>
}

function WideItemView(props){
    //Global
    const [ gConfigCast, gConfigSetCast ] = useContext(GlobalConfigContext);
    const [ viewerCast, viewerSetCast ] = useContext(ViewerContext);
    
    const {id, from, type, amount, description} = props;
    
    //state 
    const [openDescription, setOpenDescription] = useState(false);

    //Functions
    function deleteItem(e){
        const pop = new Pop(gConfigCast, gConfigSetCast);
        pop.type("warning").title("Deletion Warning").message(`Do you want to delete this "${from}"?`).callback((close)=>{
            pop.type("loading").message("Deleting. . .")
            ApiDeleteFinance(id).then(({status, data})=>{
                if(status == 200){
                    viewerSetCast({refresh:"start"});
                    pop.type("success").title("Success").message(`Item is deleted successfully.`);
                }
            });
        })
    }

    return <>
        <div className=" flex flex-wrap gap-2 sm:gap-x-4 bg-zinc-900/25 hover:bg-zinc-900 p-2" style={{flexBasis: "90rem"}}>
            <h1 className=" font-semibold">{from}</h1>
            <div className="">
                {type=="Expense"? <>
                    <SmallRoundedContentYellow>Expense</SmallRoundedContentYellow>
                </>:<>
                    <SmallRoundedContentGreen >Earn</SmallRoundedContentGreen>
                </>}
            </div>
            <div className=" flex  gap-1 mr-auto">
                <Icon name="cash" inClass=" fill-zinc-700" outClass=" w-5 h-5 self-start mt-[2px] shrink-0" />
                <h1 className="text-right truncate">{amount.toLocaleString('en')} </h1>
            </div>

            <CurveEdgeContent className=" hover:bg-zinc-700 cursor-pointer " onClick={deleteItem}>
                <Icon name="trash" inClass=" fill-red-500" outClass=" w-5 h-5" />
            </CurveEdgeContent>

            {description?<>
                <div className=" flex gap-1 items-center cursor-pointer" onClick={()=>setOpenDescription(prev=>!prev)}>
                    <span>Description</span>
                    <Icon name={openDescription?"up":"down"} inClass=" fill-zinc-300" outClass=" w-4 h-4" />
                </div>
                {openDescription?<>
                    <div className="w-full mt-2">
                        <p className="text-zinc-400 ">{description}</p>
                    </div>
                </>:""}
            </> :<>
                <h2 className=" italic text-zinc-400"> No Description . . .</h2>
            </>}

        </div>
    </>
}