import { tokenRead } from "../helper/tokenizer";

export const myMiddlewares = {
    verifyAuth: (req, res, next)=>{//Return next() if token is open else return res error 401
        const result = tokenRead(req.token);
        if(result === false)
            return res.sendStatus(401);
        return next();
    }
}