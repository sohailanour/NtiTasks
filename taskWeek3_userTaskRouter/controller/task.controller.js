const taskModel = require('../models/task.model');

class Task {
    static addTask = async (req, res) => {
        try {
            const taskDetails = new taskModel({ ...req.body, userId: req.user._id })
            await taskDetails.save()
            res.status(200).send({
                apiStatus: true,
                data: taskDetails,
                message: "data Added"
            })
        }
        catch (e) {
            res.status(500).send({
                apiStatus: false,
                message: e.message
            })
        }
    }

    static getMyTasks = async (req, res) => {
        try {
            console.log(req.query.start)
            await req.user.populate({
                path: "userTasks",
                options: { limit: 10, sort: { _id: -1 } },
                // match:{title:"t 1"}
            })
            res.status(200).send({ apiStatus: true, message: "data Added", data: req.user.userTasks })
        }
        catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message })
        }
    }

    static deleteTask = async (req, res) => {
        try {
            let taskdetails
            if (req.user.role == "User")
                taskdetails = await taskModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
            else taskdetails = await taskModel.findOneAndDelete({ _id: req.params.id })
            if (!taskdetails) throw new Error("something wrong, you can't delete this task")
            res.status(200).send({ apiStatus: true, message: "task deleted" })
        } catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message })
        }
    }

    static adminShowAll = async (req, res) => {
        try {
            const tasksData = await taskModel.find()
            res.status(200).send({ apiStatus: true, message: "tasks fetched success", data: tasksData })

        } catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message })
        }
    }

    static showSingle = async (req, res) => {
        try {
            const taskdetails = await taskModel.findById(req.params.id)
            if (!taskdetails || (req.user.role != "Admin" && taskdetails.userId.toString() != req.user._id.toString()))
                throw new Error("something wrong, you can't show this task")
            res.status(200).send({ apiStatus: true, message: "data fetched success", data: taskdetails })
        } catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message })
        }
    }

    static editTask = async (req, res) => {
        try {
            const taskdetails = await taskModel.findOneAndUpdate({
                _id: req.params.id,
                userId: req.user._id
            }, { ...req.body })

            if (!taskdetails) throw new Error("somthing wrong , you can't update this task")
            res.status(200).send({ apiStatus: true, message: "task update success", data: taskdetails })

        } catch (e) {
            res.status(500).send({ apiStatus: false, message: e.message })
        }
    }
}

module.exports = Task


/* 
add => done
remove mytasks & admin remove task => done
edit => done
show single => done
show my tasks => done
admin show all tasks  => done
admin remove task => done
*/