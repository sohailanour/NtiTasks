const userModel = require("../models/user.model")
class User {
    static register = async(req, res) =>{
        try{
            const userData = new userModel({...req.body, role:"User"})
            await userData.save()
            res.status(200).send({apiStatus:true, message:"data added successfuly"})
        }
        catch(e){
            res.status(500).send({apiStatus:false, message:e.message})
        }
    }
    static registerAsAdmin = async(req, res) =>{
        try{
            if(!req.body.role || req.body.role =="User") throw new Error("Please choose an admin type")
            const userData = new userModel(req.body)
           // userData.role="Admin"
            await userData.save()
            res.status(200).send({apiStatus:true, message:"data added successfuly"})
        }
        catch(e){
            res.status(500).send({apiStatus:false, message:e.message})
        }
    }
    static login = async(req,res)=>{
        try{
            const user = await userModel.loginUser(req.body.email, req.body.password)
            const token = await user.generateToken()
            res.status(200).send({apiStatus:true, message:"data added successfuly", data: {token,user}})
        }
        catch(e){
            res.status(500).send({apiStatus:false, message:e.message})
        }
    }
    static allUsers = async(req, res)=>{
        try{
            const userData = await userModel.find()
            res.status(200).send({apiStatus:true, message:"data added successfuly", data: userData})
        }
        catch(e){
            res.status(500).send({apiStatus:false, message:e.message})
        }
    }
    static profile =async(req,res)=>{
        res.send(req.user)
    }
}

module.exports = User
