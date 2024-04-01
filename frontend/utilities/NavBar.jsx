import { useNavigate } from "react-router-dom";
import { auth } from "../helper/Auth"
import { useCallback } from "react";
import logo from "../images/logo.svg"


export default ()=>{
    //Global
    const navigation = useNavigate();

    const logout = useCallback((e)=>{
        auth.removeToken();
        navigation("/login");
    }, []);

    return <header className="relative h-14 px-2 bg-zinc-900 flex items-center gap-2">
        <div>
            HAM
        </div>
        <div className=" h-6 bg-yellow-500 rounded" style={{width: "2px"}}>

        </div>
        <div className="flex items-center gap-2 mr-auto cursor-pointer">
            <div className="relative w-8 h-8">
                <img className=" w-full h-full object-contain" src={logo} alt="Logo"  />
            </div>
            <h2 className="text-xl text-yellow-500">Financier</h2>
        </div>
        
        
         <button className="bg-green" onClick={logout}>LogOut</button>
    </header>
}