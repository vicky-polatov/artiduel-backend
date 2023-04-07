const drawService = require('./draw.service.js')
const logger = require('../../services/logger.service')

async function getDraws(req, res) {
  try {
    logger.debug('Getting Draws')
    const filterBy = {
      txt: req.query.txt || ''
    }
    const draws = await drawService.query(filterBy)
    res.json(draws)
  } catch (err) {
    logger.error('Failed to get draws', err)
    res.status(500).send({ err: 'Failed to get draws' })
  }
}

async function getDrawById(req, res) {
  try {
    const drawId = req.params.id
    const draw = await drawService.getById(drawId)
    res.json(draw)
  } catch (err) {
    logger.error('Failed to get draw', err)
    res.status(500).send({ err: 'Failed to get draw' })
  }
}

async function addDraw(req, res) {
  // const { loggedinUser } = req
  try {
    const draw = req.body
    draw.player1.likes = []
    draw.player2.likes = []
    const addedDraw = await drawService.add(draw)
    res.json(addedDraw)
  } catch (err) {
    logger.error('Failed to add draw', err)
    res.status(500).send({ err: 'Failed to add draw' })
  }
}

async function updateDraw(req, res) {
  try {
    const draw = req.body
    const updatedDraw = await drawService.update(draw)
    res.json(updatedDraw)
  } catch (err) {
    logger.error('Failed to update draw', err)
    res.status(500).send({ err: 'Failed to update draw' })

  }
}

async function removeDraw(req, res) {
  try {
    const drawId = req.params.id
    const removedId = await drawService.remove(drawId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove draw', err)
    res.status(500).send({ err: 'Failed to remove draw' })
  }
}

module.exports = {
  getDraws,
  getDrawById,
  addDraw,
  updateDraw,
  removeDraw
}
