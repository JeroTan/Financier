//Class Template
import { RoutingPlate } from "./plate.js";

//Controller Import
import MainPage from "../controller/web/main.js";
import Signing from "../controller/api/v1/signing.js";
import { optionalData, requiredData } from "./middleware.js";


//Define the routes of that will be run to return data.
export class MainRouting extends RoutingPlate{
    routes(){
        //WEB RESOURCES
        this.GET('/',  MainPage.index);



        //Signing
        this.apiPOST('/loginGoogle', Signing.loginGoogle);

        this.apiPOST('/verifySignup', Signing.verifySignup);
        this.apiPOST('/signup', Signing.signup,  [ requiredData(["username", "password", "confirmPassword"]) ]);

        this.apiPOST('/login', Signing.login, [ requiredData(["username", "password"]) ]);
        
        this.apiPOST('/verifyAuth', Signing.verifyAuth, [ optionalData(["username", "password", "confirmPassword"]) ]);
    }
}
//******************* DEFINE ROUTES HERE ************************/