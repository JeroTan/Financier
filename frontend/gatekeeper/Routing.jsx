import { BrowserRouter, Route, Routes } from "react-router-dom"
import {Main as MainPublic} from "../pages/Main"
import Middleware from "./Middleware"
import { Login } from "../pages/Login"
import { Signup } from "../pages/Signup"
import { NotFoundPage } from "../utilities/Placeholder"
import { Dashboard } from "../pages/Dashboard"



export default ()=>{
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={
                <Middleware guards="mustNotLogin" element={<MainPublic />} />
            } />
            <Route path="/login" element={
                <Middleware guards="mustNotLogin" element={<Login />} />
            } />
            <Route path="/signup" element={
                <Middleware guards="mustNotLogin" element={<Signup />} />
            } />
            <Route path="/dashboard" element={
                <Middleware guards="loginRequired" element={<Dashboard />} /> 
            } />

            {/**Not Found */}
            <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
    </BrowserRouter>
}