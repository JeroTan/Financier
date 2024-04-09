import { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { AddButton, DashboardTitle, ToggleButton } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiSuggestWords } from "../../helper/API";

export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);

    //Initiiate
    useEffect(()=>{
        gConfigCast({sideNav: "update", val: "addFinance"});
    }, []);

    return <>
        <DashboardTitle title="Add Finance" />
        <FormInstancer />
    </>
}

function FormInstancer(){
    //Instance Modifier
    const [ form, formCast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "add":
                const id = refState.idCounter+=1;
                refState.instance.push({id:id, status: "editing"});
            break;
            case "remove":
                if(refState.instance.length < 2)
                    break;

                refState.instance = refState.instance.filter((x)=>{
                    if( (x.status == "editing" || x.status == "success" || x.status == "error") && (x.id==action.id) )
                        return false;
                    
                    return true;
                });
            break;
            case "changeStatus":
                const index = refState.instance.findIndex(x=>x.id == action.id);
                refState.instance[index].status = action.val;
            break;
            case "queueAll":
                refState.instance = refState.instance.map(x=>{
                    if(x.status == "editing" || x.status == "error")
                        x.status = "queue";
                    return x;
                })
            break;
        }

        return refState;
    },{
        idCounter: 0,
        instance: [{id: 0, status: "editing"}] //editing, queue, processing, success, error
    });


    //Submit
    function submitData(e){

    }
    function addMoreForm(e){
        formCast({run:"add"});
    }
    function removeForm(id){
        return (e)=>{
            formCast({run:"remove", id:id});
        }
    }

    return <form className="" onSubmit={submitData}>
        <div className="flex flex-col gap-5 py-5">
            {  form.instance.map((x, y)=>{
                return <Form key={x.id} id={x.id} index={y+1} status={x.status} removeForm={removeForm(x.id)} />
            }) }
        </div>
        <div className="flex gap-2 flex-wrap">
            <AddButton onClick={addMoreForm} />
            <button className=" my-main-btn-big">
                Submit
            </button>
        </div>
        
    </form>
}

function Form({id, index, status, removeForm}){
    //Data Modifier
    const [ data, dataCast ] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "updateValue":
                refState[action.key].value = action.val;
            break;
            case "updateError":
                refState[action.key].error = action.val;
            break;
            case "updateSign":
                refState.amountSign.value = typeof action.val === "boolean" ? action.val == true : (action.val ==="true" ? true: false);
                if( (refState.amountSign.value === true && refState.amount.value < 1) || (refState.amountSign.value === false && refState.amount.value > 0) ){
                    refState.amount.value *= -1;
                }
            break;
            case "updateAmount":
                refState.amount.value = Number(action.val);
                
                if(refState.amount.value > 0 ){
                    refState.amountSign.value = true;
                }else{
                    refState.amountSign.value = false;
                }
            break;
        };
        return refState;
    }, {
        amount: {value: -0, error:""},
        amountSign: {value: false, error:""},//Gain or Expense //This will not be sent to backend
        amountFrom: {value: "", error:""},
        description: {value: "", error:""},
        time: {value: "", error:""},
    });

    return <main className=" rounded bg-zinc-900/50 overflow-hidden">
        <div className="sm:px-3 px-2 py-2 flex bg-zinc-900/75">
            <div>#{index} | <span className=" italic text-zinc-500">{status}</span></div>
            <div className="ml-auto cursor-pointer" onClick={removeForm}>
                <Icon name="close" inClass=" fill-zinc-500" outClass=" w-6 h-6" />
            </div>
        </div>

        <div className="relative sm:px-3 px-5 pt-5 pb-8 flex justify-center gap-4 md:flex-nowrap flex-wrap">
            <div className="">
                <AddAmountInput mod={[data, dataCast]}/>
                <AddAmountFrom  mod={[data, dataCast]}/>
                <AddTime mod={[data, dataCast]}/>
            </div>
            <div className=" md:block hidden bg-zinc-800 rounded-full" style={{width: "5px"}}></div>
            <div className=" relative flex-col sm:w-64 w-full">
                <AddDescription mod={[data, dataCast]}/>
            </div>
        </div>
    </main>
}

function AddAmountInput(props){
    const [data, dataCast] = props.mod;
    const [amount, amountSign] = [data.amount.value, data.amountSign.value];


    function updateAmountSign(e){
        const {value} = e.target;
        dataCast({run:"updateSign", val:value});
    }
    function updateAmount(e){
        const {value} = e.target;
        dataCast({run:"updateAmount", val:value});
    }   

    return <>
        <div className="mb-4">
            <ToggleButton data={ [{value:false, name:"Expense"}, {value:true, name:"Gain"}] } currentValue={amountSign} callback={updateAmountSign} />
        </div>
        <div className="mb-2">
            <label className="ml-1">Amount:</label>
            <input type="number" className="my-field w-full bg-zinc-500" placeholder="10,000" value={amount} onInput={updateAmount} />
        </div>

    </>
}

function AddAmountFrom(props){
    //Global
    const [data, dataCast] = props.mod;
    const amountFrom = data.amountFrom.value;
    
    //DOM Reference
    const Input = useRef();

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
            case "fetching":
                refState.fetching = true;
            break;
            case "fetched":
                refState.fetching = false;
            break;
            case "cacheInput":
                refState.cacheInput = action.val;
            break;
        }
        return refState;
    },{
        words: [],
        fetching: false,
        cacheInput: "",//use this to check if the search is still the same with the current input if same then empty this if not then you may fetch a new again after the other finish
    });

    function update(e){
        const {value} = e.target;
        dataCast({run:"updateValue", key:"amountFrom", val:value});
        suggestionCast({run:"cacheInput", val:value});
        fetchSuggestion(value);
    }

    const fetchSuggestion = useCallback((currentInput)=>{
        if(suggestion.fetching === true)
            return;

        suggestionCast({run:"fetching"});
        ApiSuggestWords(currentInput).then((x)=>{
            suggestionCast({run:"fetched"});

            if(suggestion.cacheInput !== currentInput)
                fetchSuggestion(suggestion.cacheInput);

            if(x.status === 200){
                suggestionCast({run:"addWords", val:x.data});
            }
        })

    }, [suggestion.fetching, suggestion.cacheInput]);

    function selectSuggestedWord(i){
        return (e)=>{
            dataCast({run:"updateValue", key:"amountFrom", val: suggestion.words[i] });
            clearSuggestion(e);
        }
    }
    function clearSuggestion(e){
        suggestionCast({run:"clearWords"});
    }

    return <>
        <div className="mb-2 relative">
            <label className="ml-1">From:</label>
            <input onBlur={clearSuggestion} ref={Input} tabIndex={0} className="my-field w-full bg-zinc-500" placeholder="Lottery" value={amountFrom} onInput={update} />
            <div className="absolute flex flex-col w-full rounded-b overflow-hidden bg-zinc-800">
                
                {suggestion.fetching === false ? <>
                    {suggestion.words.length > 0 ? suggestion.words.map((x,i)=>{
                        return <div key={x} className="px-2 py-1 hover:bg-zinc-700 cursor-pointer" onClick={selectSuggestedWord(i)}>
                            {x}
                        </div>
                    }) :""}
                </>: <>
                    <span className="px-2 py-1 animate-pulse font-bold">. . .</span>
                </>}
            </div>
        </div>
    </>
}

function AddDescription(props){
    return <>
        <label>Description</label>
        <textarea className="my-text-area w-full mt-1" rows={5}  placeholder="I bought a new card."></textarea>
        
    </>
}

function AddTime(props){
    const [data, dataCast] = props.mod;
    const time = data.time.value;

    function update(e){
        const {value} = e.target;
        dataCast({run:"updateValue", key:"time", val:value});
    } 

    return <>
        <div className="mb-2">
            <label className="ml-1">Time:</label>
            <input type="datetime-local" className="my-field w-full bg-zinc-500" value={time} onInput={update} />
        </div>
    </>
}