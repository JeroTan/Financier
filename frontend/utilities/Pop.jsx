import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { GlobalConfigContext } from "./GlobalConfig";
import Icon from "./Icon";



export function PopComponent(){
    //Global
    const [gConfig, gConfigCast] = useContext(GlobalConfigContext);
    const {
        isOpen, 
        width, 
        icon,
        iconColor, 
        iconAnimate,
        title, 
        message, 
        acceptButton, 
        rejectButton, 
        acceptButtonText, 
        rejectButtonText, 
        acceptButtonCallback, 
        rejectButtonCallback, 
        closeButton, 
        closeButtonCallback,
        backdropTrigger,
        backdropTriggerCallback,
        customDialog
    } = gConfig.popUp;

    const dialogRef = useRef();

    //Close And Off Modal
    useEffect(()=>{
        if(isOpen)
            dialogRef.current.showModal();
        else
            dialogRef.current.close();
    }, [isOpen]);

    if(customDialog){
        return customDialog;
    }

    //functionality
    const closeThisPop = useCallback((e)=>{
        gConfigCast({pop:"close"});
    }, []);


    return <dialog ref={dialogRef} className="my-dialog " style={{width: width}} onClick={(e)=>{
        if(!backdropTrigger)
            return;
        if(!backdropTriggerCallback){
            closeThisPop();
            return;
        }
        backdropTriggerCallback(closeThisPop);
    }}>
        {closeButton?<>
        <div className="flex justify-end">
            <div className="cursor-pointer hover:scale-110 delay-75 fill-zinc-600 hover:fill-zinc-500" 
            onClick={()=>{
                if(!closeButtonCallback){
                    closeThisPop();
                    return;
                }
                closeButtonCallback(closeThisPop);
                
            }}>
                <Icon name="close" outClass="w-5 h-5" />
            </div>
        </div>
        </>:""}
        {icon?<>
        <div className="flex w-full justify-center mt-1">
            <Icon name={icon} inClass={`${iconColor} `} outClass={`w-24 h-24 ${iconAnimate}`} />
        </div>
        </>:""}
        {title?<>
        <div className="flex w-full justify-center mt-2">
            <h1 className={`my-big-text`}>{title}</h1>
        </div>
        </>:""}
        {message?<>
        <div className="flex w-full justify-center mt-1">
            <p className={`text-zinc-500`}>{message}</p>
        </div>
        </>:""}
        {acceptButton || rejectButton?<>
        <div className="flex w-full justify-center gap-5 mt-8 flex-wrap">
            {acceptButton?<>
                <button className="my-main-btn-big" onClick={()=>{
                    if(!acceptButtonCallback){
                        closeThisPop();
                        return;
                    }
                    acceptButtonCallback(closeThisPop);
                }}>
                    {acceptButtonText}
                </button>
            </>:""}
            {rejectButton?<>
                <button className="my-main-btn-outline-big" onClick={()=>{
                    if(!rejectButtonCallback){
                        closeThisPop();
                        return;
                    }
                    rejectButtonCallback(closeThisPop);
                    
                }}>
                    {rejectButtonText}
                </button>
            </>:""}
        </div>
        </>:""}
        <div className="py-3"></div>

        
    </dialog>
}

export class Pop{
    constructor(state, dispatch){
        this.state = state;
        this.dispatch = dispatch;
        
        //Shorteners
        const basicContent = {
            isOpen: true,
            width: "450px",
            icon: "check",
            iconColor: "fill-green-600",
            iconAnimate: "a-fade-in-scale",
            title: "",
            message: "",
            acceptButton: true,
            rejectButton: true,
            acceptButtonText: "Okay",
            rejectButtonText: "Cancel",
            acceptButtonCallback: undefined,
            rejectButtonCallback: undefined,
            closeButton: true,
            closeButtonCallback: undefined,
            backdropTrigger: true,
            backdropTriggerCallback: undefined,
            customDialog: undefined,
        }
        //Shorteners

        this.frame = {
            success:{
                ...basicContent,
                icon: "check",
                iconColor: "fill-green-600",
                title: "Success",
            },
            error:{
                ...basicContent,
                icon: "cross",
                iconColor: "fill-red-600",
                title: "Error",   
            },
            info:{
                ...basicContent,
                icon: "i",
                iconColor: "fill-sky-600",
                title: "Info",
            },
            warning:{
                ...basicContent,
                icon:"warning",
                iconColor: "fill-amber-500",
                title: "Warning",
            },
            loading:{
                ...basicContent,
                icon:"loadingDonut",
                iconColor: "fill-yellow-500",
                iconAnimate: "a-kuru-kuru",
                title: "",
                message: "Loading. . .",
                backdropTrigger: undefined,
                acceptButton: undefined,
                rejectButton: undefined,
                closeButton: undefined,
            }
        };
    }

    //--InHouseHelper--//
    updateOne(key, data){
        this.dispatch( { pop:"update", val: {[key]: data } } );
    }
    //--InHouseHelper--//

    //--Setter--//
    addState(state){
        this.state = state;
        return this;
    }
    addDispatch(dispatch){
        this.dispatch = dispatch;
        return this;
    }
    type(type){//This will determine the basic structure of the popup
        this.dispatch({pop:"update", val:this.frame[type]});
        return this;
    }
    width(width){
        this.updateOne("width", width);
    }
    title(title){
        this.updateOne("title", title);
        return this;
    }
    message(message){
        this.updateOne("message", message);
        return this;
    }
    /*@accept - callback for accept button, @reject - callback for reject/cancel button, @close - callback for close button. All of them must accept "close" argument. */
    callback(accept = undefined, reject = undefined, close = undefined, backdrop = undefined){ 
        this.dispatch( { pop:"update", val: {
            acceptButtonCallback: accept && typeof accept === "function"?accept : undefined,
            rejectButtonCallback: reject && typeof reject === "function"?reject : undefined,
            closeButtonCallback: close && typeof close === "function"?close : undefined,
            backdropTriggerCallback: backdrop && typeof backdrop === "function"?backdrop : undefined,
        } } );
        return this;
    }
    button(accept = true, reject = true, close = true, backdrop = true){
        this.dispatch( { pop:"update", val: {
            acceptButton: accept,
            rejectButton: reject,
            closeButton: close,
            backdropTrigger: backdrop,
        } } );

        return this;
    }
    close(){
        this.dispatch({pop:"close"});
        return this;
    }
       
    //--Setter--//
}