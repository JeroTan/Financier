//Class Template
import { RoutingPlate } from "./plate.js";

//Controller Import
import MainPage from "../controller/web/main.js";
import Signing from "../controller/api/v1/signing.js";
import { Finance } from "../controller/api/v1/finance.js";
import { optionalData, optionalQuery, requiredData, verifyAuth } from "./middleware.js";
import { Profile } from "../controller/api/v1/profile.js";


//Define the routes of that will be run to return data.
export class MainRouting extends RoutingPlate{
    routes(){
        //WEB RESOURCES
        this.GET('/',  MainPage.index);



        //Signing
        this.apiPOST('/loginGoogle', Signing.loginGoogle);
        this.apiPOST('/setupUsername', Signing.setupUsername,  [verifyAuth, optionalData(["username"]) ]);

        this.apiPOST('/verifySignup', Signing.verifySignup, [optionalQuery(["field"]), optionalData(["username", "password", "confirmPassword"])]);
        this.apiPOST('/signup', Signing.signup,  [ requiredData(["username", "password", "confirmPassword"]) ]);

        this.apiPOST('/login', Signing.login, [ requiredData(["username", "password"]) ]);
        
        this.apiPOST('/verifyAuth', Signing.verifyAuth, [ optionalData(["username", "password", "confirmPassword"]) ]);

        this.apiPOST('/changePassword', Signing.changePassword, [verifyAuth, requiredData(["old", "new", "confirm"])]);


        //Finance
        this.apiGET('/suggestWord', Finance.suggestWord, [verifyAuth, optionalQuery(["search"]) ] );
        this.apiPOST('/verifyForm', Finance.verifyForm, [verifyAuth, optionalQuery(["field"]), optionalData(["amount", "amountFrom", "description", "time"])] );
        this.apiPOST('/finance', Finance.add, [verifyAuth, requiredData(["amount", "amountFrom", "description", "time"]) ]);
        this.apiGET('/finance', Finance.get, [ verifyAuth, optionalQuery(["dateFrom", "dateTo", "search", "amountFrom", "amountTo", "type", "sortName", "sortAmount", "limit", "offset"]) ]  );
        this.apiDELETE('/finance', Finance.delete, [verifyAuth, optionalQuery(["search"])]);
        this.apiGET('/currency', Finance.getCurrency, [verifyAuth]);

        //Profile
        this.apiGET('/username', Profile.username, [verifyAuth]);

    }
}
//******************* DEFINE ROUTES HERE ************************/