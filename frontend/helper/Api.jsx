import axios from "axios";

//LINKS
// const domain = "localhost:8000/";
// const protocol = "http://";
// const apiVersionIndex = "api/v1/";
const domain = "financier-uimj.onrender.com/";
const protocol = "http://";
const apiVersionIndex = "api/v1/";

export function ApiLink(query="", withApiLink = true){
    return protocol+domain+(withApiLink&&apiVersionIndex)+query;
}

//>>InHouse Helper
function errorProcessing(error){
    const errorData = error?.response?.data ?? undefined;
    const status = error?.response?.status ?? undefined;
    return {
        status: status,
        data: errorData,
    }
}
function successProcessing(success){
    const successData = success.data;
    const status = success.status;
    return {
        status: status,
        data: successData,
    }
}

class ApiRequestPlate{
    constructor(){
        this.Config = {
            baseURL: ApiLink(),
            headers:{
                "Accept": "application/json",
                'Access-Control-Allow-Credentials': 'true',
                "Access-Control-Allow-Origin": "<origin>",
                "Content-Type": "application/json",
        }};
        this.Inst = axios.create(this.Config);
    }

    url(url){
        this.Config["url"] = url;
        return this;
    }
    data(data){
        this.Config["data"] = data;
        return this;
    }
    params(params){
        this.Config["params"] = params;
        return this;
    }
    onUploadProgress(callback){
        this.Config["onUploadProgress"] = callback;
        return this;
    }
    onDownloadProgress(callback){
        this.Config["onDownloadProgress"] = callback;
        return this;
    }
    
    
    //DefineModifiers
    file(){
        this.Config.headers["Content-Type"] = "multipart/form-data";
        return this;
    }
    auth(){
        this.Config.headers["Authorization"] = `Bearer ${localStorage.getItem('token') || ""}`;
        return this;
    }

    //RequestType
    method(method){
        this.Config["method"] = method;
        return this;
    }
    get(){
        return this.method("get");
    }
    post(){
        return this.method("post");
    }
    patch(){
        return this.method("patch");
    }
    put(){
        return this.method("put");
    }
    delete(){
        return this.method("delete");
    }

    async request(){
        let response;
        try{
            response = await this.Inst.request(this.Config);
            response = successProcessing(response);
        }catch(e){
            response = errorProcessing(e);
        }
        return response;
    }
    
}

export class Fetcher{//ApiFetch that waits for it to finish and do try again if ever| param is array, api is the api in api caller and todo is the callback
    constructor(api=undefined){
        if(api && typeof api == "function")
            this.api = api;
        this.fetching = false;
        this.cache = false;
        this.param = false;
        this.todo = ()=>false;
    }
    addParam(param){
        this.param = arguments;
        return this;
    }
    addApi(api){
        this.api = api;
        return this;
    }
    addTodo(todo){
        this.todo = todo;
        return this;
    }
    fetch(){
        if(this.fetching)
            return this;

        this.cache = this.param; //put the param in cache in case there is a param for it to check
        this.fetching = true;

        const This = this;
        this.api(...this.param).then(x=>{
            
            this.fetching = false;
            if(  JSON.stringify(this.cache) !== JSON.stringify(this.param) )
                This.fetch();
            
            this.todo(x.status, x.data); 
        })
        return this;
    }



}



/*************** DEFINE API CALLER HERE ****************** */
export async function ApiLoginWithGoogle(credentials){
    const api = new ApiRequestPlate;
    return await api.url("loginGoogle").data({credentials: credentials}).post().request();
}

export async function ApiLogin(data){
    const api = new ApiRequestPlate;
    return await api.url('login').data(data).post().request()
}

export async function ApiSetupUsername(data){
    const api = new ApiRequestPlate;
    return await api.url('setupUsername').auth().data(data).post().request();
}


export async function ApiVerifySignUp(field, data){ //data in {} param means what fieldName
    const api = new ApiRequestPlate;
    return await api.url('verifySignup').params({field: field}).data(data).post().request();
}
export async function ApiSignup(data){
    const api = new ApiRequestPlate;
    return await api.url('signup').data(data).post().request();
}


export async function ApiVerifyAuth(token){
    const api = new ApiRequestPlate;
    return await api.url('verifyAuth').auth().data({token:token}).post().request();
}

//AddFinance
export async function ApiSuggestWords(search){
    const api = new ApiRequestPlate;
    return await api.url('suggestWord').auth().params({search: search}).get().request();
}
export async function ApiVerifyForm(field, data){
    const api = new ApiRequestPlate;
    return await api.url('verifyForm').auth().params({field: field}).data(data).post().request();
}
export async function ApiAddFinance(data){
    const api = new ApiRequestPlate;
    return await api.url('finance').auth().data(data).post().request();
}

export async function ApiGetFinance(query ){
    //dateFrom, dateTo, search, amountFrom, amountTo, type, sortName, sortAmount, offset, limit
    const api = new ApiRequestPlate;
    return await api.url('finance').auth().params(query).get().request();
}

export async function ApiDeleteFinance(id){
    const api = new ApiRequestPlate;
    return await api.url('finance').auth().params({id:id}).delete().request();
}

export async function ApiGetCurrency(){
    const api = new ApiRequestPlate;
    return await api.url('currency').auth().get().request();
}


export async function ApiUsername(){
    const api = new ApiRequestPlate;
    return await api.url('username').auth().get().request();
}

export async function ApiChangePassword(data){
    const api = new ApiRequestPlate;
    return await api.url("changePassword").auth().data(data).post().request();
}