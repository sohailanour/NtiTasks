const router = require("express").Router()
const { auth } = require("../middleware/auth")
const controller = require("../controller/task.controller")
const taskModel = require("../models/task.model")
router.post('/addTask', auth("User"), controller.addTask)
router.get('/myTasks', auth("User"), controller.getMyTasks)
router.delete('/deleteTask/:id', auth(""), controller.deleteTask)
router.get('/showAllTasks', auth("Admin"), controller.adminShowAll)
router.get("/showSingle/:id", auth(""), controller.showSingle)
router.patch("/editTask/:id", auth(""), controller.editTask)

module.exports = router


