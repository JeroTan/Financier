import { Outlet } from "react-router-dom";
import PagePlate from "../utilities/PagePlate";
import Icon from "../utilities/Icon";
import { Fragment, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { propertyExclusion } from "../helper/ParseArgument";
import e from "cors";

export function Dashboard(){
    return <PagePlate>
        <Container>
            <Outlet />
        </Container>
    </PagePlate>
}

function Container(props){
    return <main className="flex justify-center">
        <main className="w-[96rem] p-2 mt-5">
            {props.children}
        </main>
    </main>
}

export function DashboardTitle({title}){
    return <>
    <div className=" w-fit border-b-2 rounded border-zinc-200 px-4  py-2 mb-8">
        <h1 className="md:text-4xl sm:text-2xl text-xl font-semibold  text-yellow-500">{title}</h1>
    </div>
    </>
}

export function AddButton(props){
    return <>
        <div className="group relative cursor-pointer w-10 hover:w-24" {...props}>
            <div className=" overflow-hidden opacity-0 group-hover:opacity-100 absolute group-hover:w-24 group-hover:pl-11 h-10 flex px-1 items-center rounded-full border-2 border-yellow-500">
                <span className="text-zinc-300">Add</span>
            </div>
            <Icon name="add" outClass="w-10 h-10 absolute" inClass="fill-yellow-500" />
        </div>
    </>
}

export function RoundedContent(props){
    const children = props.children;
    const className = props.className;
    const refineProps = propertyExclusion(["body", "className"], props);

    return <div className={`w-fit flex items-center gap-2 rounded-full px-4 py-1 bg-zinc-900/50 ${className}`} {...refineProps}>
        {children}
    </div>
}
export function CurveEdgeContent(props){
    const children = props.children;
    const className = props.className;
    const refineProps = propertyExclusion(["body", "className"], props);

    return <div className={`w-fit flex items-center gap-2 rounded px-4 py-1 bg-zinc-900/50 ${className}`} {...refineProps}>
        {children}
    </div>
}

export function ToggleButton(props){
    const {data, currentValue, callback} = props;
    return <>
        <div className="rounded bg-zinc-900/50 inline-block overflow-hidden" onClick={callback}>
            { data.map((x=>{
                return <button key={x.value} 
                    type="button" 
                    className={`px-3 pt-2 pb-1 ${currentValue == x.value ? " border-b-4 border-yellow-500" : ""}`} 
                    value={x.value.toString()}
                >
                    {x.name}
                </button>
            })) }
        </div>
    </>
}

export function errorChecker(api, dataField, updater){
    api(Object.keys(dataField)[0], dataField).then(x=>{
        if(x.status == "200"){
            clearError(dataField, updater);
        }else if(x.status == "422"){
            updateError(x.data, updater);
        }
    });
}

export function clearError(dataField, updater){
    Object.keys(dataField).forEach(thisField=>{
        updater({run:"updateError", key:thisField, val:""})
    });
}
export function updateError(dataField, updater){
    Object.keys(dataField).forEach(thisField=>{
        updater({run:"updateError", key:thisField, val:dataField[thisField]})
    });
}


export function InputComponent(props){
    const inputRef = props?.inputRef;
    const error = props?.error;
    const refineProps = propertyExclusion(["inputRef"], props);

    

    return <>
        <input type="text" className={`${error ? "my-field-error" : "my-field"} w-full bg-zinc-500`} {...refineProps} ref={inputRef} />
        <ErrorText message={error} />
    </>
}

export function ErrorText(props){
    const message = props.message;
    return <small className=" my-error-text">{message}</small>
}

export function DropDownSuggestion(props){
    const searchWord = props.searchWord;
    const api = props.api;
    const selection = props.selection;
    const active = props.active ?? true;

    //NonState
    let fetching = false;
    let cacheInput = "";//use this to check if the search is still the same with the current input if same then empty this if not then you may fetch a new again after the other finish
    
    const [suggestion, suggestionCast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "addWords":
                refState.words = action.val;
            break;
            case "clearWords":
                if(refState.words.length > 0)
                    refState.words = [];
            break;
           
        }
        return refState;
    },{
        currentSelected: "",
        words: [],
    });
    
    function selectSuggestedWord(i){
        return (e)=>{
            selection(suggestion.words[i]);
            suggestionCast({run:"clearWords"});
        }
    }
    
    
    const fetchSuggestion = useCallback((searchWord)=>{
        if(fetching)
            return;
        fetching = true;

        cacheInput = searchWord
        api(searchWord).then((x)=>{ //This is the API THING
            fetching = false;

            if(cacheInput !== searchWord){
                fetchSuggestion(searchWord);
                return;
            }
                

            if(x.status === 200){
                suggestionCast({run:"addWords", val:x.data});
            }

            
        })

    }, [fetching, cacheInput]);

    //Fetch the word Changes or Update
    useEffect(()=>{
        if(!active)
            return;
            
        fetchSuggestion(searchWord)
    }, [searchWord]);

    if(!active)
        return "";

    return <>
        <div className="absolute flex flex-col w-full rounded-b overflow-hidden bg-zinc-800">
            {fetching === false ? <>
                {suggestion.words.length > 0 ? suggestion.words.map((x,i)=>{
                    return <div key={x} className="px-2 py-1 hover:bg-zinc-700 cursor-pointer" onPointerDown={selectSuggestedWord(i)}>
                        {x}
                    </div>
                }) :""}
            </>: <>
                <span className="px-2 py-1 animate-pulse font-bold">. . .</span>
            </>}
        </div>
        </>
}

export function DropDown(props){
    const data = props.data;
    const active = props.active;
    const selection = props.selection;

    if(!active)
        return "";

    function selectItem(data){
        return (e)=>{
            selection(data);
        }
    }

    return <>
        <ul className=" absolute w-full bottom-0 translate-y-[100%] rounded overflow-hidden bg-zinc-900/50">
        { data.length && data.map(x=>{
            return <Fragment key={x}>
                <li className=" hover:bg-zinc-700/75 px-4 py-2 cursor-pointer" onPointerDown={selectItem(x)}>
                    {x}
                </li>
            </Fragment>
        })}
        </ul>
        
    </>

}