//DEPENDENCIES
import express from "express";
import cors from "cors";
import bearerToken from "express-bearer-token";

//Helpers
import { printEndpoints } from "../helper/backendUtilities.js";
import { getToday } from "../helper/math.js";

// Define Express Here
function ExpressAppInitiator(){
    const app = express();
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
    }
   
    app.use(bearerToken());
    app.use(cors(CORS));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true,
    }));
    return app;
}


export class RoutingPlate{
    constructor(){
        //Define Stuff here;
        this.app = ExpressAppInitiator();
        this.protocol = "http";
        this.domain = "localhost";
        this.port = "8000";
        this.apiVersionIndex = [
            "/api/v1",
        ];
        
        this.runMessage = ()=>{
            return (
`============================
Web application is now serving: 
${this.protocol}://${this.domain}:${this.port}

LIST OF ROUTES:
${printEndpoints(this.app)}
============================`
        );
        }
        

        this.GET = createCallbackRequest(this.app, "get");
        this.POST = createCallbackRequest(this.app, "post");
        this.PUT = createCallbackRequest(this.app, "put");
        this.PATCH = createCallbackRequest(this.app, "patch");
        this.DELETE = createCallbackRequest(this.app, "delete");
        this.apiGET = createCallbackRequest(this.app, "get", this.apiVersionIndex);
        this.apiPOST = createCallbackRequest(this.app, "post", this.apiVersionIndex);
        this.apiPUT = createCallbackRequest(this.app, "put", this.apiVersionIndex);
        this.apiPATCH = createCallbackRequest(this.app, "patch", this.apiVersionIndex);
        this.apiDELETE = createCallbackRequest(this.app, "delete", this.apiVersionIndex);
    }

    //You May define on the go
    structure(data){
        Object.keys(data).forEach(e => {
            this[e] = data[e];
        });
    }

    routes(){

    }

    run(){
        this.routes();
        this.app.listen( this.port, ()=>{
            console.log(this.runMessage());
        });
    }
}



//InHouse Helpers
function requestLogger(req, res, next){
    console.log(`${req.url} : ${getToday()}`);
    next();
}

function createCallbackRequest(app, requestType, withPreLink = false){ //Callback must accept req, res
    return (route, callback, middlewares=[])=>{

        //From the interface of Controller get refine the data here;
        if(typeof callback === 'object' && Array.isArray(callback)){
            let reviewCallback;
            if(typeof callback[0] === "function"){
                reviewCallback = new callback[0];
            }else{
                reviewCallback = callback[0];
            }
            callback = (req, res)=>{
                reviewCallback.newREQ(req);
                reviewCallback.newRES(res);
                reviewCallback.newBODY();
                reviewCallback.newQUERY();
                reviewCallback[callback[1]]();
            };

        }

        if( Array.isArray(withPreLink) ){
            for(let i = 0; i < withPreLink.length; i++){
                app.options(withPreLink[i]+route, ...middlewares, callback);
                app[requestType](withPreLink[i]+route, ...middlewares, requestLogger, callback);
            }
            return;
        }
        app.options(route, ...middlewares, callback);
        app[requestType](route, ...middlewares, requestLogger, callback);
    };
}