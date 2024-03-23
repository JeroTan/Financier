//Use Express to handle serve
import express from "express";
const app = express();

//RoutingLinks
const protocol = "http";
const domain = "localhost";
const port = "8000";

//Controller Import



//Run Routes from Express including the listener
export function runRoutes(){
    webRoutes();
    apiRoutes();
    app.listen( port, ()=>{
        console.log("Now Serving Website");
    });
}


//Define the page that will be serve
function webRoutes(){

} 

//Define the routes of that will be run to return data.
function apiRoutes(){

}


///HELPER Function
function routingTemplate(requestType, route, callback){
    app[requestType](route, callback);
}

function GET(route, controller){
    routingTemplate("get", route, controller);
}

function POST(route, controller){
    routingTemplate("post", route, controller);
}

function PUT(route, controller){
    routingTemplate("put", route, controller);
}

function PATCH(route, controller){
    routingTemplate("patch", route, controller);
}

function DELETE(route, controller){
    routingTemplate("delete", route, controller);
}