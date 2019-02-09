//Dependencies
const child_process = require('child_process')

const {basicPort, moduleName} = require('./settings.js')

//Manages rooms livecycle and socket rerouting
class RoomManager {
	constructor() {
		this.rooms = {}	
		this.length = 0
		this.handlers = []
	}

	//Sets the main handler, that will run if no handler attached to the room
	//Handler is
	//function onMessage(msg, roomId)
	setMessageHandler(handler) {
		this.handlers[-1] = handler
	}

	//Sets handler for each room
	//Handler is
	//functiom onMessage(msg, roomId)
	setRoomMessageHandler(roomId, handler) {
		//Optional, can be changed/removed
		if(!this.rooms[roomId]) {
			throw "RoomManager.setRoomMessageHandler: No room with this id (" + roomId + ")" 
		}
		this.handlers[roomId] = handler
	}

	//Creates new room
	//I recommend to create an room, and then send init data with messages
	createRoom() {
		//Find first free id
		//Not fast, altogether works not that bad
		var id = 0
		for(; id < this.length; id++) {
			if(!this.rooms[id]) {
				break
			}
		}
		this.length = Math.max(id, this.length)

		//Forks an process and creates some handlers
		//You can add own handlers on exit event, for example
		var self = this
		this.rooms[id] = child_process.fork(moduleName, ['' + id])
		this.rooms[id].on('exit', function() {
			delete self.rooms[id]
			delete self.handlers[id]
		})
		this.rooms[id].on('message', function(msg) {
			if(self.handlers[id]) {
				self.handlers[id](msg, id)
			}
			else if(self.handlers[-1]) {
				self.handlers[-1](msg, id)
			}
		})

		return id
	}

	sendMessage(roomId, msg) {
		//Optional, can be removed/changed
		if(!this.rooms[roomId]) {
			throw "RoomManager.sendMessage: No room with this id (" + roomId + ")" 
		}
		this.rooms[roomId].send(msg)
	}

	rerouteSocket(socket, roomId) {
		//Optional, can be removed/changed
		if(!this.rooms[roomId]) {
			throw "RoomManager.rerouteSocket: No room with this id (" + roomId + ")" 
		}
		socket.emit('reroute', roomId + basicPort)
	}
}

module.exports = RoomManager