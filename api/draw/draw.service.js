const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy={title:''}) {
    try {
        const criteria = {
            title: { $regex: filterBy.title, $options: 'i' }
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
            vendor: draw.vendor,
            price: draw.price
        }
        const collection = await dbService.getCollection('draw')
        await collection.updateOne({ _id: ObjectId(draw._id) }, { $set: drawToSave })
        return draw
    } catch (err) {
        logger.error(`cannot update draw ${drawId}`, err)
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
