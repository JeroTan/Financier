import { useMemo, useReducer } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default (props)=>{
    //Structure
    const children = props.children;
    const cleanBody = props.cleanBody == false;

    //Component
    const navbar = useMemo( ()=>!cleanBody && <NavBar /> , [cleanBody]);
    const footer = useMemo( ()=>!cleanBody && <Footer /> , [cleanBody]);

    return <main className="relative min-h-screen flex flex-col text-slate-300">
        {navbar}

        {/* The body of the page */}
        <main className="relative grow bg-zinc-800">
            {children}
        </main>
        {/* The body of the page */}

        {navbar}
    </main>
}