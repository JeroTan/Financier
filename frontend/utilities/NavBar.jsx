import { useNavigate } from "react-router-dom";
import { auth } from "../helper/Auth"
import { useCallback } from "react";

export default ()=>{
    //Global
    const navigation = useNavigate();

    const logout = useCallback((e)=>{
        auth.removeToken();
        navigation("/login");
    }, []);

    return <header className="p-2 bg-zinc-800">
        Financier <button className="bg-green" onClick={logout}>LogOut</button>
    </header>
}