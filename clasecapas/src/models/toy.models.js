class ToyModel{
    constructor(){
        this.db=[]
    }

    getAll=()=>{
        return this.db
    }
    create=data=>{
         data.price= data?.price ?? 1000
        tis.db.push(data)
         return{
            newData:data,
            result: true
    }
}
} export default ToyModel
