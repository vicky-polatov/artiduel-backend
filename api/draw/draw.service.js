const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
    try {
        let criteria = {}
        if (filterBy.txt) {
            const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
            criteria = {
                $or: [{ 'player1.fullname': txtCriteria }, { 'player2.fullname': txtCriteria }, { title: txtCriteria }]
            }
        }
        const collection = await dbService.getCollection('draw')
        var draws = await collection.find(criteria).toArray()
        return draws
    } catch (err) {
        logger.error('cannot find draws', err)
        throw err
    }
}

async function getById(drawId) {
    try {
        const collection = await dbService.getCollection('draw')
        const draw = collection.findOne({ _id: ObjectId(drawId) })
        return draw
    } catch (err) {
        logger.error(`while finding draw ${drawId}`, err)
        throw err
    }
}

async function remove(drawId) {
    try {
        const collection = await dbService.getCollection('draw')
        await collection.deleteOne({ _id: ObjectId(drawId) })
        return drawId
    } catch (err) {
        logger.error(`cannot remove draw ${drawId}`, err)
        throw err
    }
}

async function add(draw) {
    try {
        const collection = await dbService.getCollection('draw')
        await collection.insertOne(draw)
        return draw
    } catch (err) {
        logger.error('cannot insert draw', err)
        throw err
    }
}

async function update(draw) {
    try {
        const drawToSave = {
            _id: ObjectId(draw._id), // needed for the returnd obj
            createdAt: draw.createdAt,
            player1: draw.player1,
            player2: draw.player2,
            title: draw.title
        }

        const collection = await dbService.getCollection('draw')
        await collection.updateOne({ _id: ObjectId(draw._id) }, { $set: drawToSave })
        return draw
    } catch (err) {
        logger.error(`cannot update draw ${draw._id}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update
}
