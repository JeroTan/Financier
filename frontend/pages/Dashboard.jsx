import { Outlet } from "react-router-dom";
import PagePlate from "../utilities/PagePlate";
import Icon from "../utilities/Icon";

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
        <h1 className="md:text-4xl sm:text-2xl text-xl font-semibold  text-yellow-400">{title}</h1>
    </div>
    </>
}

export function AddButton(props){
    return <>
        <div className="group relative cursor-pointer w-10 hover:w-24" {...props}>
            <div className=" overflow-hidden opacity-0 group-hover:opacity-100 absolute group-hover:w-24 group-hover:pl-11 h-10 flex px-1 items-center rounded-full border-2 border-yellow-500">
                <span className="text-zinc-300">Add</span>
            </div>
            <Icon name="add" outClass="w-10 h-10 absolute" inClass="fill-yellow-400" />
        </div>
    </>
}

export function ToggleButton(props){
    const {data, currentValue, callback} = props;
    return <>
        <div className="rounded bg-zinc-900/50 inline-block overflow-hidden" onClick={callback}>
            { data.map((x=>{
                return <button key={x.value} 
                    type="button" 
                    className={`px-3 pt-2 pb-1 ${currentValue == x.value ? " border-b-4 border-yellow-400" : ""}`} 
                    value={x.value.toString()}
                >
                    {x.name}
                </button>
            })) }
        </div>
    </>
}