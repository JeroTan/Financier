import { useReducer } from "react"
import { Link } from "react-router-dom"

export const Login = ()=>{

    return <main className="absolute h-full w-full flex flex-col justify-center items-center gap-y-2">
        <div className="w-96 rounded-lg p-8 bg-zinc-900">
            <h2 className="my-header-big">Login</h2>
            <p className="text-yellow-500/50">No account yet? <Link to="/signup" className=" underline">Sign-up</Link> instead.</p>
            <div className="mb-12"></div>
            <LoginForm />            
        </div>
        <div className=" text-center text-yellow-500/50 font-thin">
            Other Signing Option
        </div>
        <button className="w-96 py-2 bg-slate-300 hover:bg-slate-200 rounded-lg text-zinc-900 font-semibold ">
            Login with Google
        </button>
    </main>
}

function LoginForm(){
    const [ data, dataCast ] = useReducer((state, action)=>{
        const refState = state;
    }, {
        username: "",
        password: "",
    });

    return <form onSubmit={(e)=>{
        e.preventDefault();
    }}>
        <div className="mb-2">
            <label>Username</label>
            <input type="text" className="my-field w-full" placeholder="" />
        </div>
        <div className="mb-2">
            <label>Password</label>
            <input type="password" className="my-field w-full" placeholder="" />
        </div>
        <div className="mt-7 flex justify-center">
            <button className="my-main-btn-big">Login</button>
        </div>
    </form>
}