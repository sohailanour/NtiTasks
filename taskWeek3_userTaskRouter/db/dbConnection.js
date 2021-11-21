const mongoose = require("mongoose")
try{
    mongoose.connect(`${process.env.DBURL}${process.env.DBNAME}`)
    console.log("database connected")
}
catch(e){
    console.log(e.message)
}
