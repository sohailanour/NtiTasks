const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

// const generalAuth = async(req,res, next)=>{
//     try{
//         const token = req.header("Authorization").replace("Bearer ", "")
//         const decodedToken = jwt.verify(token, 'helloAll')
//         const user = await userModel.findOne({_id:decodedToken._id, 'tokens.token': token})
//         if(!user) throw new Error()
//         req.user=user
//         req.token=token
//         next()
//     }
//     catch(e){
//         res.status(500).send({apiStatus:false, message:"unauthorized", data:e.message})
//     }
// }

const auth = (type)=>{
    return async(req,res,next)=>{
        try{
            const token = req.header("Authorization").replace("Bearer ", "")
            const decodedToken = jwt.verify(token, 'helloAll')
            const user = await userModel.findOne({_id:decodedToken._id, 'tokens.token': token})
            if(!user) throw new Error()
            if(type && user.role!=type) throw new Error(`enta msh ${type}`)
            req.user=user
            req.token=token
            next()
        }
        catch(e){
            res.status(500).send({apiStatus:false, message:"unauthorized", data:e.message})
        }
    }

}

module.exports = { auth }