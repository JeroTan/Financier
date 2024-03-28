//Use Express to handle serve
import express from "express";
const app = express();
import cors from "cors";

//Controller Import
import MainPage from "../controller/web/main.js";
import Signing from "../controller/api/v1/signing.js";


//HelperImport
import { printEndpoints } from "../helper/view.js";


//RoutingLinks
const protocol = "http";
const domain = "localhost";
const port = "8000";
const apiVersionIndex = [
    "/api/v1",
];
const CORS = {
    origin: function (origin, callback) {
        console.log(origin);
        const allowedOrigin = ["http://localhost:8000", "http://localhost:8001"];
        if( allowedOrigin.includes(origin) ){
            return callback(null, origin);
        }
        return callback(null, false);
      },
    creadentials: true,
    optionsSuccessStatus: 200,
};


//Run Routes from Express including the listener| This should be called on index.js
export function runRoutes(){
    webRoutes();
    apiRoutes();
    app.listen( port, ()=>{
        console.log(`
============================
Web application is now serving: 
${protocol}://${domain}:${port}

LIST OF ROUTES:
${printEndpoints(app)}
============================
        `);
    });
}








//  Define the page that will be serve
//******************* DEFINE ROUTES HERE ************************/
function webRoutes(){
    //Main
    GET('/',  MainPage.index);

} 

//Define the routes of that will be run to return data.
function apiRoutes(){
    //Signing
    apiPOST('/login_google', Signing.loginGoogle, [cors(CORS)]);
}
//******************* DEFINE ROUTES HERE ************************/












///HELPER Function 
function routingTemplate(requestType, withPreLink = false){ //Callback must accept req, res
    return (route, callback, middlewares=[])=>{
        if( Array.isArray(withPreLink) ){
            for(let i = 0; i < withPreLink.length; i++){
                app.options(withPreLink[i]+route, cors(), callback);
                app[requestType](withPreLink[i]+route, cors(), callback);
            }
            return;
        }
        app.options(route, ...middlewares, callback);
        app[requestType](route, ...middlewares, callback);
    };
}

const GET = routingTemplate("get");
const POST = routingTemplate("post");
const PUT = routingTemplate("put");
const PATCH = routingTemplate("patch");
const DELETE = routingTemplate("delete");
const apiGET = routingTemplate("get", apiVersionIndex);
const apiPOST = routingTemplate("post", apiVersionIndex);
const apiPUT = routingTemplate("put", apiVersionIndex);
const apiPATCH = routingTemplate("patch", apiVersionIndex);
const apiDELETE = routingTemplate("delete", apiVersionIndex);

