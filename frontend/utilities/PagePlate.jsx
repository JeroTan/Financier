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

    return <main>
        {navbar}

        {/* The body of the page */}
        <main>
            {children}
        </main>
        {/* The body of the page */}

        {navbar}
    </main>
}