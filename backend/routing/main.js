//Use Express to handle serve
import express from "express";
const app = express();

//RoutingLinks
const protocol = "http";
const domain = "localhost";
const port = "8000";

//Controller Import
import MainPage from "../controller/web/main.js";



//Run Routes from Express including the listener
export function runRoutes(){
    webRoutes();
    apiRoutes();
    app.listen( port, ()=>{
        console.log(`
        Web application is now serving: 
        ${protocol}://${domain}:${port}
        `);
    });
}


//Define the page that will be serve
function webRoutes(){
    //Main
    GET('/',  MainPage.index);
} 

//Define the routes of that will be run to return data.
function apiRoutes(){

}


///HELPER Function 
function routingTemplate(requestType, route, callback){ //Callback must accept req, res
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