const userController = require("../controller/user.controller")
const  {auth } = require("../middleware/auth")
const router = require("express").Router()
router.post('/register', userController.register)
router.post('/registerAsAdmin',auth("Admin"), userController.registerAsAdmin)
router.post('/login', userController.login)
router.get('/profile',auth(""), userController.profile)
router.get('',auth("Admin") , userController.allUsers)
router.post('/logoutAll',auth(""), async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send({'done':"done"})
    }
    catch(e){
        res.send({e})
    }
})
router.post('/logout',auth(""), async(req,res)=>{
    req.user.tokens= req.user.tokens.filter(t=>{
        console.log(t)
        return t.token!= req.token
    })
    await req.user.save()
    res.send('done')
})

//___________________for test _____________________
router.get('/all', userController.allUsers)

// const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })
// const fs = require("fs")
// router.post('/addImage', auth("User"), upload.single('img'), async(req,res)=>{
//     oldName = req.file.destination+req.file.filename
//     newName = req.file.destination+ 
//     fs.rename('hello.txt', 'world.txt', () =>{});
         
//     res.send(req.file)
// })
const upload = require('../middleware/fileUpload')
router.post('/addImage', auth("User"), upload.single('img'), async(req,res)=>{
    try{
        // res.send(req.file)
        req.user.image = "uploads/"+ req.user._id +"/"+ req.file.filename
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.send({e})
    }
})
module.exports = router