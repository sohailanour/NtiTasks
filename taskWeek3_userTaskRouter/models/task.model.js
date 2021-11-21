const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    title:{
        type:String, trim:true, required:true
    },
    content:{
        type:String, trim:true
    }
})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task