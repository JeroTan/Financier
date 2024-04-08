import { useContext, useEffect, useReducer, useState } from "react"
import { GlobalConfigContext } from "../../utilities/GlobalConfig"
import { DashboardTitle } from "../Dashboard";
import Icon from "../../utilities/Icon";

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
    const [ formIdCounter, formIdCounterSet ] = useState(1);
    const [ formInstance, formInstanceSet ] = useState([
        {id: 0, status: "queue"}, //queue, process, error, success
    ]);


    //Submit
    function submitData(e){

    }
    function addMoreForm(){

    }
    function removeForm(id){
        return (e)=>{

        }
    }

    return <form className="" onSubmit={submitData}>
        <div className="flex flex-col gap-5 py-5">
            {  formInstance.map((x, y)=>{
                return <Form key={x.id} id={x.id} index={y+1} status={x.status} removeForm={removeForm(x.id)} />
            }) }
        </div>
        <button className=" my-main-btn-big">
            Submit
        </button>
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
        };
        return refState;
    }, {
        expense: {value: "", error:""},
        expenseSign: {value: "Gain", error:""},//Gain or Expense
        expenseFrom: {value: "", error:""},
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

        <div className="relative sm:px-3 px-2 py-5 flex justify-center gap-4 md:flex-nowrap flex-wrap">
            <div className="">
                <AddMoneyInput />
            </div>
            <div className=" md:block hidden bg-zinc-800 rounded-full" style={{width: "5px"}}></div>
            <div className="">
                <AddDescription />
            </div>
        </div>
    </main>
}

function AddMoneyInput(props){
    return <>
        <div className="mb-2">
            <label>Amount</label>
            <input type="number" name="amount" className="my-field w-full" placeholder="10,000" />
        </div>

    </>
}

function AddExpenseFrom(props){
    return <></>
}

function AddDescription(props){
    return <>
        <textarea>Hello</textarea>
    </>
}

function AddTime(props){//Auto Or SelfMade
    return <></>
}