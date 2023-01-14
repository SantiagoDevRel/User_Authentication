const mongoose = require("mongoose")

const connectMongoose = async()=>{
    await mongoose.connect("mongodb://localhost:27017/KnowledgeHut")
    console.log("Connected to KnowledgeHut DB")

}

const userSchema = new mongoose.Schema({
    name: String ,
    password: String,
    username:String,
})

//Access or create the collection (if not create, will create one)
const Users = mongoose.model("Users",userSchema)



module.exports = {connectMongoose, userSchema, Users}