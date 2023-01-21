const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getDraws, getDrawById, addDraw, updateDraw, removeDraw } = require('./draw.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getDraws)
router.get('/:id', getDrawById)
router.post('/', requireAuth, addDraw)
router.put('/:id', requireAuth, updateDraw)
router.delete('/:id', requireAuth, removeDraw)
// router.delete('/:id', requireAuth, requireAdmin, removeDraw)

module.exports = router