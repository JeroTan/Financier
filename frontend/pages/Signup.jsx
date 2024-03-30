import { Link } from "react-router-dom"
import { GoogleSignIn } from "./Main"
import PagePlate from "../utilities/PagePlate"



export function Signup(){
    
    return <PagePlate clean={true}>
        <main className="absolute h-full w-full flex flex-col justify-center items-center gap-y-2">
            <div className="w-96 rounded-lg p-8 bg-zinc-900">
                <h2 className="my-header-big">Signup</h2>
                <p className="text-yellow-500/50">Already have an account? <Link to="/login" className=" underline">Login</Link> instead.</p>
                <div className="mb-12"></div>
                        
            </div>
            <div className="mt-2 text-center text-yellow-500/50 font-thin">
                Other Signing Option
            </div>
            <GoogleSignIn />
        </main>
    </PagePlate>
}

export function SignupForm(){

    return <form>

        
    </form>
}