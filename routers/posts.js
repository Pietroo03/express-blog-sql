const express = require('express')
const router = express.Router()
const PostController = require('../controllers/PostController.js')

router.get('/', PostController.index)
router.get('/:id', PostController.show)
router.post('/', PostController.store)
router.put('/:slug', PostController.update)
router.delete('/:id', PostController.destroy)

module.exports = router