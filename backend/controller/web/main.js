import { view } from "../../helper/view.js";

export default {
    index: (req, res)=>{
        view('index.html', res);
    }
}