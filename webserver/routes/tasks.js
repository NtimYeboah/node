const express = require('express')
const { all, create, retrieve, update, remove } = require('../controllers/tasks')
const router = express.Router()

router.route('/').get(all).post(create)
router.route('/:id').get(retrieve).patch(update).delete(remove)

module.exports = router;
