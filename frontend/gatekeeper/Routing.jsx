import { BrowserRouter, Route, Routes } from "react-router-dom"
import NotFoundPage from "./NotFoundPage"
import {Main as MainPublic} from "../pages/Main"



export default ()=>{
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPublic />} />

            {/**Not Found */}
            <Route path="/*" element={<NotFoundPage/>}/>
        </Routes>
    </BrowserRouter>
}