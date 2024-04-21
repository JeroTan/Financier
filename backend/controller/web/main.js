import { file, view } from "../../helper/backendUtilities.js";

/**
 * Every Callback here must be or optional if you want to have req and res
 * req means request or the requesting data or payload
 * res mean what will be the response or to send the response back;
 */


export default {
    index: (req, res)=>{
        view('index.html', res);
    },
    jsBundle: (req, res)=>{
        view('dist/bundle.js', res);   
    },
    favIcon: (req, res)=>{
        file('fav.ico', res);
    }
}