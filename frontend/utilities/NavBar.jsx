import { useNavigate } from "react-router-dom";
import { auth } from "../helper/Auth"
import { useCallback, useContext } from "react";
import logo from "../images/logo.svg"
import Icon from "./Icon";
import { GlobalConfigContext } from "./GlobalConfig";


export default ()=>{
    //Global
    const [ gConfig, gConfigCast ] = useContext(GlobalConfigContext);
    const navigation = useNavigate();

    const logout = useCallback((e)=>{
        auth.removeToken();
        navigation("/login");
    }, []);

    return <header className="relative h-14 px-2 bg-zinc-900 flex items-center gap-2">
        <div className="fill-yellow-500/75 hover:fill-yellow-400 cursor-pointer" onClick={()=>{
            gConfigCast({sideNav:"open"});
        }}>
            <Icon name="hamburgerMenu" inClass="" outClass="w-10 h-10" />
        </div>
        <div className=" h-7 bg-zinc-600 rounded" style={{width: "1px"}}>

        </div>
        <div className="flex items-center gap-2 mr-auto cursor-pointer hover:brightness-110" onClick={()=>{
            navigation("/");
        }}>
            <div className="relative w-8 h-8">
                <img className=" w-full h-full object-contain" src={logo} alt="Logo"  />
            </div>
            <h2 className="text-xl text-yellow-500/75">Financier</h2>
        </div>
        
        
         <button className="bg-green" onClick={logout}>LogOut</button>
    </header>
}