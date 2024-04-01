//Use Express to handle serve
import express from "express";
const app = express();

import cors from "cors";
import bearerToken from "express-bearer-token";

//Controller Import
import MainPage from "../controller/web/main.js";
import Signing from "../controller/api/v1/signing.js";


//HelperImport
import { printEndpoints } from "../helper/view.js";
import { getToday } from "../helper/math.js";


//Routing Definition
const protocol = "http";
const domain = "localhost";
const port = "8000";
const apiVersionIndex = [
    "/api/v1",
];
const CORS = {
    origin: function (origin, callback) {
        const allowedOrigin = ["http://localhost:8000", "http://localhost:8001"];
        if( allowedOrigin.includes(origin) ){
            return callback(null, origin);
        }
        return callback(null, false);
      },
    creadentials: true,
    optionsSuccessStatus: 200,
};
app.use(bearerToken());


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
    const basicMid = [
        cors(CORS), 
        express.json(), 
        express.urlencoded({
            extended: true,
        })
    ];

    //Signing
    apiPOST('/loginGoogle', Signing.loginGoogle, [...basicMid]);

    apiPOST('/verifySignup', Signing.verifySignup, [...basicMid]);
    apiPOST('/signup', Signing.signup, [...basicMid]);

    apiPOST('/login', Signing.login, [...basicMid]);
    
    apiPOST('/verifyAuth', Signing.verifyAuth, [...basicMid]);
}
//******************* DEFINE ROUTES HERE ************************/












///HELPER Function 
function routingTemplate(requestType, withPreLink = false){ //Callback must accept req, res
    return (route, callback, middlewares=[])=>{
        const modCallback = (req, res)=>{//Define Additionals Here after running the controller;
            console.log(`${req.url} : ${getToday()}`);
            callback(req, res);
        }

        if( Array.isArray(withPreLink) ){
            for(let i = 0; i < withPreLink.length; i++){
                app.options(withPreLink[i]+route, ...middlewares, modCallback);
                app[requestType](withPreLink[i]+route, ...middlewares, modCallback);
            }
            return;
        }
        app.options(route, ...middlewares, modCallback);
        app[requestType](route, ...middlewares, modCallback);
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

