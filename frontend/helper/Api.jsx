import axios from "axios";

//LINKS
const domain = "localhost:8000/";
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
        this.Config.headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
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
const api = new ApiRequestPlate;




/*************** DEFINE API CALLER HERE ****************** */
export async function ApiLoginWithGoogle(credentials){
    return await api.url("login_google").data({credentials: credentials}).post().request();
}

