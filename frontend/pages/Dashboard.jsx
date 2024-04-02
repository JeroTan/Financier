import { Outlet } from "react-router-dom";
import PagePlate from "../utilities/PagePlate";

export function Dashboard(){
    return <PagePlate>
        <Outlet />
    </PagePlate>
}