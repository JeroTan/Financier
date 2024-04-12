import { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { AddButton, DashboardTitle, DropDownSuggestion, InputComponent, ToggleButton, clearError, errorChecker, updateError } from "../Dashboard";
import Icon from "../../utilities/Icon";
import { ApiAddFinance, ApiSuggestWords, ApiVerifyForm } from "../../helper/API";

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
    const [ form, formCast ] = useReducer((state, action)=>{
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
                let startingPoint = true;
                refState.instance = refState.instance.map(x=>{
                    if( !(x.status == "editing" || x.status == "error") )
                        return x;
                    
                    if(startingPoint){
                        startingPoint = false;
                        x.status = "processing";
                    }else{
                        x.status = "queue";
                    }
                    return x;
                })
            break;
            case "nextForm":
                for(let i = 0; i <  refState.instance.length; i++){
                    if(refState.instance[i].status === "queue"){
                        refState.instance[i].status = "processing";
                        break;
                    }
                }
            break;
        }

        return refState;
    },{
        idCounter: 0,
        instance: [{id: 0, status: "editing"}] //editing, queue, processing, success, error
    });


    //Submit
    function submitData(e){
        e.preventDefault();
        formCast({run:"queueAll"})
    }

    function addMoreForm(e){
        formCast({run:"add"});
    }
    function removeForm(id){
        return (e)=>{
            formCast({run:"remove", id:id});
        }
    }
    function processForm(id){
        //Make a next function here to tell if the thing is success or error
        function next(status = "success"){
            formCast({run:"changeStatus", id:id, val:status==="success"?"success":"error"});
            formCast({run:"nextForm"});
        }

        return (formProcessCallback)=>{ //The callback provided must have next parameter
            formProcessCallback(next);
        }
    }

    return <form className="" onSubmit={submitData}>
        <div className="flex flex-col gap-5 py-5">
            {  form.instance.map((x, y)=>{
                return <Form key={x.id} id={x.id} index={y+1} status={x.status} removeForm={removeForm(x.id)} processForm={processForm(x.id)} />
            }) }
        </div>
        <div className="flex gap-2 flex-wrap">
            <AddButton onClick={addMoreForm} />
            <button type="submit" className=" my-main-btn-big">
                Submit
            </button>
        </div>
        
    </form>
}

function Form({id, index, status, removeForm, processForm}){
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
        amount: {value: "", error:""},
        amountSign: {value: false, error:""},//Earn or Expense //This will not be sent to backend
        amountFrom: {value: "", error:""},
        description: {value: "", error:""},
        time: {value: "", error:""},
    });

    //UploadForm
    useEffect(()=>{
        if(status != "processing")
            return;

        processForm((next)=>{
            const sendData = {
                amount: data.amount.value,
                amountFrom: data.amountFrom.value,
                description: data.description.value,
                time: data.time.value
            };
            ApiAddFinance(sendData).then(x=>{
                if(x.status == "200"){
                    clearError(sendData, dataCast);
                    next();
                }else{
                    if(x?.data)
                        updateError(x.data, dataCast);
                    next("error");

                }
            })
        })
    }, [status]);



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
    const [amount, amountSign, amountError] = [data.amount.value, data.amountSign.value, data.amount.error];


    function updateAmountSign(e){
        const {value} = e.target;
        dataCast({run:"updateSign", val:value});
    }
    function updateAmount(e){
        const value = Number(e.target.value);
        e.target.value = value;
        dataCast({run:"updateAmount", val:value});
        errorChecker(ApiVerifyForm, {amount:value}, dataCast);
    }   

    return <>
        <div className="mb-4">
            <ToggleButton data={ [{value:false, name:"Expense"}, {value:true, name:"Earn"}] } currentValue={amountSign} callback={updateAmountSign} />
        </div>
        <div className="mb-2">
            <label>Amount:</label>
            <InputComponent type="number" value={amount} placeholder="10,000" onInput={updateAmount} error={amountError}  />
        </div>

    </>
}

function AddAmountFrom(props){
    //Global
    const [data, dataCast] = props.mod;
    const amountFrom = data.amountFrom.value;
    const amountFromError = data.amountFrom.error;

    function update(e){
        const {value} = e.target;
        dataCast({run:"updateValue", key:"amountFrom", val:value});
        errorChecker(ApiVerifyForm, {amountFrom:value}, dataCast);
    }

    function selectSuggestedWord(data){
        dataCast({run:"updateValue", key:"amountFrom", val: data });
    }

    const [ suggestion, suggestionSet ] = useState(false); //Use to close and open suggestion

    return <>
        <div className="mb-2 relative">
            <label>From:</label>
            <InputComponent onBlur={()=>suggestionSet(false)} onFocus={()=>suggestionSet(true)} placeholder="Lottery" value={amountFrom} onInput={update} error={amountFromError}  />
            <DropDownSuggestion api={ApiSuggestWords} searchWord={amountFrom} selection={selectSuggestedWord} active={suggestion} />
        </div>
    </>
}

function AddDescription(props){
    const [data, dataCast] = props.mod;
    const description = data.description.value;
    const descriptionError = data.description.error;

    function update(e){
        const {value} = e.target;
        dataCast({run:"updateValue", key:"description", val:value});
        errorChecker(ApiVerifyForm, {description:value}, dataCast);
    } 

    return <>
        <label>Description</label>
        <textarea className="my-text-area w-full mt-1" rows={5}  placeholder="I bought a new card." value={description} onInput={update}></textarea>
        <small className=" my-error-text">{descriptionError}</small>
    </>
}

function AddTime(props){
    const [data, dataCast] = props.mod;
    const time = data.time.value;
    const timeError = data.time.error;

    function update(e){
        const {value} = e.target;
        dataCast({run:"updateValue", key:"time", val:value});
        errorChecker(ApiVerifyForm, {time:value}, dataCast);
    } 

    return <>
        <div className="mb-2">
            <label>Time:</label>
            <InputComponent type="datetime-local" value={time} onInput={update} error={timeError}  />
        </div>
    </>
}

