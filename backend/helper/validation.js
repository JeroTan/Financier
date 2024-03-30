import { getRegex, strArrtToArr } from "./parseArguments.js";


/*****************TEMPLATE //Do not touch *********************/
export class Validation{
    constructor(input = "", fieldName = ""){
        this.input = input;
        this.fieldName = fieldName;
        this.argument = strArrtToArr(argument);
        this.action = [];
    }

    //--Setter--//
    addInput(d){
        this.input = d;
        return this;
    }
    addField(d){
        this.fieldName = d;
        return this;
    }
    addActualField(d){
        this.actualFieldName = d;
        return this;
    }
    //--Setter--//

    //--Internal--//
    addValidateAction(process){
        this.action[this.action.length] = async ()=>{
            return await new Promise((resolve, reject)=>{
                process(resolve, reject);
            });
        }
        return this;
    }
    createErrorMessage(d){
        if(typeof(d) === "function"){
            return d(this.addField);//Allow them to have a callback to get the field name;
        }
        return d;
    }
    //--Internal--//

    //--Public Object Method--//
    required(argument=[], customMessage=false){
        return this.addValidateAction((resolve, reject)=>{
            if(this.input !== null && this.input !== undefined && this.input !== "" && this.input !== 0 && (Array.isArray(this.input) ? this.input.length > 0 :true ) ){
                return resolve(true);
            }

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }
            
            reject(`${this.fieldName} is required.`);
            
        });
    }
    iString(argument=[], customMessage=false){//Check if string
        return this.addValidateAction((resolve, reject)=>{
            if(typeof this.input === "string"){
                return resolve(true);
            }

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }
            
            reject(`${this.fieldName} is not a string.`);
            
        });
    }
    regex(argument=[], customMessage=false){
        return this.addValidateAction((resolve, reject)=>{
            const ThisInput = this.input;
            if(
                argument.every(x=>{
                    return getRegex(x).test(ThisInput);
                })
            ){
                return resolve(true);
            }
            
            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }
            
            reject(`${this.fieldName} is invalid.`);
        });
    }
    notRegex(argument=[], customMessage=false){
        return this.addValidateAction((resolve, reject)=>{
            const ThisInput = this.input;
            if(
                argument.every(x=>{
                    return !getRegex(x).test(ThisInput);
                })
            ){
                return resolve(true);
            }

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }
            
            reject(`${this.fieldName} is invalid.`);
        });
    }
    max(argument=[], customMessage=false){
        return this.addValidateAction((resolve, reject)=>{
            if(typeof this.input === "string" && this.input.length > argument[0])
                return resolve(true);
            else if(typeof this.input === "number" && this.input > argument[0]){
                return resolve(true);
            }

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }

            if(typeof this.input === "string")
                reject(`${this.fieldName} exceeded the character limit of ${argument[0]}.`);
            else if(typeof this.input === "number"){
                reject(`${this.fieldName} must be no more than ${argument[0]}.`);
            }
            else{
                reject(`${this.fieldName} exceeded the limit of ${argument[0]}.`)
            }
        });
    }
    min(argument=[], customMessage=false){
        return this.addValidateAction((resolve, reject)=>{
            if(typeof this.input === "string" && this.input.length < argument[0])
                return resolve(true);
            else if(typeof this.input === "number" && this.input < argument[0]){
                return resolve(true);
            }

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }

            if(typeof this.input === "string")
                reject(`${this.fieldName} must be at least ${argument[0]} character length.`);
            else if(typeof this.input === "number"){
                reject(`${this.fieldName} must be less than ${argument[0]}.`);
            }
            else{
                reject(`${this.fieldName} must be minium of; ${argument[0]}.`);
            }
        });
    }
    same(argument=[], customMessage=false){//accept arguement as instance of this class;
        return this.addValidateAction((resolve, reject)=>{
            if( argument[0].input === this.input )
                return resolve(true);

            if(customMessage){
                return reject(this.createErrorMessage(customMessage));
            }

            reject(`${this.fieldName} is not the same with ${argument[0].fieldName}`);
        });
    }

    //--Public Object Method--//


    async validate(response = false){
        async function doValidation(action = this.action, current = 0){
            if(action.length <= current){
                return true;
            }

            try{
                const result =  await action[current](); //check the current validation
                if(result === true){
                    return await doValidation(action, current+1);//call this again to do the next one
                }
                
            }catch(e){
                return e;
            }
        }
        const result = await doValidation();
        if(response === false){
            return result;
        }else{
            if(result!== true){
                const errorToSend = {};
                errorToSend[this.actualFieldName] = result;
                response.status(422).json(errorToSend);
            }else{
                response.status(200);
            }
        }
        
    }
}


/************ DEFINE FUNCTION SHORTCUTS HERE *******************/
function verifyPassword(password){
    const valPassword = new Validation(password, "Password");

    return valPassword.required().min(8).max(128).validate();
}
function verifyConfirmPassword(password, confirmPassowrd){
    const valPassword = new Validation(password, "Password");
    const valConfirmPassword = new Validation(confirmPassowrd, "Confirm Password");

    return valConfirmPassword.required().same([valPassword]).validate();
}
function verifyUsername(username){
    const valUsername = new Validation(username, "Username");

    return valUsername.required().regex(/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/).max(32).validate();
}