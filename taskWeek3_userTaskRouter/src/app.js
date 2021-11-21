require("dotenv").config()
require('../db/dbConnection')
const express = require("express")
const cors = require('cors')
const userRoutes = require('../routes/user.routes')
const taskRoutes = require('../routes/task.routes')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/task', taskRoutes)

app.get("*", (req,res)=>{
    res.status(404).send({
        apiStatus:false,
        message:"api invalid link"
    })
})
module.exports = app