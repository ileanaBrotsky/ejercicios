import ToyModel from "../models/toy.models.js"

class ToyService {
    constructor(){
        this.toyModel= new ToyModel()
    }
    getAll=()=>{
        return this.toyModel.getAll()
    }
    create=data=>{
      
         return this.toyModel.create(data)
}
getCheapest=()=>{
    const data = this.toyModel.getAll()
    .sort((t1,t2)=> t1.price> t2.price)
    return data
}
}
 export default ToyService