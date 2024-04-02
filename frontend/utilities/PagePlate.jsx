import { useMemo, useReducer } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { SideNav } from "./SideNav";

export default (props)=>{
    //Structure
    const children = props.children;
    const clean = props.clean ?? false;

    //Component
    const navbar = useMemo( ()=>!clean && <NavBar /> , [clean] );
    const footer = useMemo( ()=>!clean && <Footer /> , [clean] );
    const sidenav = useMemo( ()=>!clean && <SideNav /> , [clean] );

    return <main className="relative min-h-screen flex flex-col text-slate-300">
        {navbar}

        {/* The body of the page */}
        <main className="relative grow bg-zinc-800">
            {children}
        </main>
        {/* The body of the page */}

        {footer}
        {sidenav}
    </main>
}