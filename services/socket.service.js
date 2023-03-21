const userService = require('../api/user/user.service')
const logger = require('./logger.service')
const { getWord } = require('./game.service')
const { makeId } = require('./util.service')

var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', () => {
            console.log(`Socket disconnected [id: ${socket.id}]`)
            if (socket.roomId) onUserQuit(socket.id, socket.roomId)
        })
        socket.on('room-level-entrance', async (level) => {
            // TODO - make sure after refresh the user is back in to the socket room (both of them)
            socket.level = level
            const sockets = await _getAllSockets()
            const formattedSockets = sockets.map(socket => {
                return { id: socket.id, level: socket.level, roomId: socket.roomId || null, userId: socket.userId || null }
            })
            const opponent = formattedSockets.find(onlineUser => {
                return (onlineUser.level === level && (!onlineUser.roomId) && onlineUser.id !== socket.id)
            })

            // Match! go play. the opponent is actually the first one to create the room.
            if (opponent) {
                const word = getWord(socket.level)
                const opponentSocket = await _getUserSocket(opponent.userId)
                const roomId = makeId()
                socket.roomId = roomId
                opponentSocket.roomId = roomId
                const user = await userService.getById(socket.userId)
                const opponentUser = await userService.getById(opponentSocket.userId)
                socket.join(roomId)
                opponentSocket.join(roomId)
                socket.emit('matched-opponent', { roomId, isHost: false, level: socket.level, word, opponentPlayer: { _id: opponentUser._id, fullname: opponentUser.fullname, imgUrl: opponentUser.imgUrl } })
                opponentSocket.emit('matched-opponent', { roomId, isHost: true, level: socket.level, word, opponentPlayer: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl } })
            }
            // _printSockets()
        })
        socket.on('left-room', async () => {
            const sockets = await _getAllSockets()
            const opponent = sockets.find(onlineUser => {
                return (onlineUser.roomId === socket.roomId && onlineUser.id !== socket.id)
            })
            if (opponent) {
                gIo.to(socket.roomId).emit('opponent-quit', socket.userId)
                opponent.level = null
                opponent.roomId = null
                opponent.leave(socket.roomId)
            }
            if (socket.roomId) socket.leave(socket.roomId)
            socket.level = null
            socket.roomId = null
            _printSockets()
            // socket.leave(socket.roomId)
            // delete socket.roomId
        })
        socket.on('clear-room-listening', async (isGameOn) => {
        })
        socket.on('rejoin-room', async roomId => {
            if (socket.roomId) return
            // const sockets = await _getAllSockets()
            // const opponent = sockets.find(s => s.roomId === roomId)
            // if (opponent) opponent.join(roomId)
            socket.roomId = roomId
            socket.join(roomId)
        })
        socket.on('canvas-changed', dataURL => {
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            socket.broadcast.to(socket.roomId).emit('opponent-canvas-change', dataURL);
        })
        socket.on('user-watch', userId => {
            logger.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`)
            socket.join('watching:' + userId)

        })
        socket.on('set-user-socket', (userId) => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })
    })
}

const onUserQuit = async (socketId, socketRoomdId) => {
    const sockets = await _getAllSockets()
    const opponentSocket = sockets.find(onlineUser => {
        return (onlineUser.roomId === socketRoomdId && onlineUser.id !== socketId)
    })
    
    if (opponentSocket) {
        console.log('letting opponent socket know you left...')
        opponentSocket.emit('opponent-disconnect')
        opponentSocket.leave(opponentSocket.roomId)
        opponentSocket.level = null
        opponentSocket.roomId = null
    }
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId.toString()
    const socket = await _getUserSocket(userId)

    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
        // _printSockets()
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    logger.info(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _reJoinUser(socket) {

}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}, roomId: ${socket.roomId}, level: ${socket.level}`)
}

module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
