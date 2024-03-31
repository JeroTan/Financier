import { useNavigate } from "react-router-dom";
import { auth } from "../helper/Auth"

export default ()=>{
    //Global
    const navigation = useNavigate();

    return <header className="p-2">
        Financier <button className="bg-green" onClick={()=>{
            auth.removeToken();
            navigation("/login");
        }}>LogOut</button>
    </header>
}