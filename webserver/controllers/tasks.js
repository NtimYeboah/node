const Task = require('../models/Task')

const all = async (req, res) => {
    try {
        const tasks = await Task.find({})
        return res.status(200).json({ tasks })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const create = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        return res.status(201).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error})
    }
}

const retrieve = async (req, res) => {
    try {
        const {id: taskId} = req.params
        const task = await Task.findOne({_id: taskId})
        if (!task) {
            return res.status(404).json({ msg: `No task with Id: ${taskId}`})
        }
        res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const update = async (req, res) => {
    try {
        const {id: taskId} = req.params
        const task = await Task.findOneAndUpdate({_id: taskId}, req.body, {
            new: true,
            runValidators: true,
        })

        if (!task) {
            return res.status(404).json({msg: `Task not found. Id: ${taskId}`})
        }

        return res.status(200).json({ task })
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

const remove = async (req, res) => {
    try {
        const {id: taskId} = req.params
        const task = await Task.findOneAndDelete({_id: taskId})
        if (!task) {
            return res.status(404).json({msg: `No task with ID: ${taskId}`})
        }
        return res.status(200).json({task})
    } catch (error) {
        return res.status(500).json({msg: error})
    }
}

module.exports = {
    all,
    create,
    retrieve,
    update,
    remove
}
