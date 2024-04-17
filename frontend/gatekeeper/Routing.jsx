import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom"
import {Main as MainPublic} from "../pages/Main"
import Middleware from "./Middleware"
import { Login } from "../pages/Login"
import { Signup } from "../pages/Signup"
import { NotFoundPage } from "../utilities/Placeholder"
import { Dashboard } from "../pages/Dashboard"
import FinancialReport from "../pages/DashboardComp/FinancialReport"
import AddFinance from "../pages/DashboardComp/AddFinance"
import Profile from "../pages/DashboardComp/Profile"
import { SetupUsername } from "../pages/SetupUsername"
import SourceList from "../pages/DashboardComp/SourceList"



export default ()=>{
    return <HashRouter>
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
             <Route path="/username" element={
                <Middleware guards="loginRequired" element={<SetupUsername />} />
            } />

            {/*Dashboard */}
            <Route path="/dashboard" element={
                <Middleware guards="loginRequired" element={<Dashboard />} /> 
            } >
                <Route index element={<FinancialReport/>} />
                <Route path="financialReport" element={<FinancialReport/>} />
                <Route path="addFinance" element={<AddFinance/>} />
                <Route path="sourceList" element={<SourceList/>} />
               
                <Route path="profile" element={<Profile/>} />
            </Route>
            

            {/**Not Found */}
            <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
    </HashRouter>
}