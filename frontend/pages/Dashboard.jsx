import { Outlet } from "react-router-dom";
import PagePlate from "../utilities/PagePlate";

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
    <div className=" w-fit border-b-4 rounded border-zinc-200 px-4  py-2 bg-yellow-500">
        <h1 className="md:text-4xl sm:text-2xl text-xl font-semibold  text-zinc-800">{title}</h1>
    </div>
    </>
}