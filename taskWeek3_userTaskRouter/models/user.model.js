const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"],
        trim:true
    },
    email:{
        type:String,
        required: [true, "Email is Required"],
        unique: [true, "Email used before"],
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid Email Format")
        }
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        trim:true
    },
    role:{
        type:String, 
        enum:["Admin", "User", "SAdmin"],
        required:true
    },
    image:{
        type:String, trim:true
    },
    position:{
        type:String,
        required: function(){ return this.role != "User" }
    },
    tokens:[
        {token:{type:String, required:true}}
    ]
}, {
    timestamps:true
})

userSchema.methods.toJSON = function(){
    const user = this.toObject()
    // delete user.password
    // delete user.__v
    let myDeleted = ["__v"]
    myDeleted.forEach(d=> delete user[d])
    return user
}
userSchema.pre('save', async function(){
    const user = this
    if(user.isModified("password")) user.password = await bcrypt.hash(user.password, 8)
})
userSchema.statics.loginUser = async(email, password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error("invalid email address")
    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid) throw new Error("invalid password")
    return user
}
userSchema.methods.generateToken = async function(){
    const userData = this
    const token = jwt.sign({_id:userData._id}, "helloAll")
    userData.tokens = userData.tokens.concat({token})
    userData.save()
    return token
}

userSchema.virtual('userTasks',{
    ref:"Task",
    localField:"_id",
    foreignField:"userId"
})

const User = mongoose.model("User", userSchema)
module.exports = User
