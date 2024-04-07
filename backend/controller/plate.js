export class Controller{
    constructor(req = null, res = null){
        this.req = req;
        this.res = res;
    }
    
    newREQ(req){
        this.req = req;
        return this;
    }

    newRES(res){
        this.res = req;
        return this;
    }

    newBODY(){
        this.body = this.req.body;
        return this;
    }
    
    newQUERY(){
        this.query = this.req.query;
        return this;
    }

}