//Dependencies
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const RoomManager = require('./room_manager.js')

const {jwtSecretKey, httpPort} = require('./settings.js')

//Setting up a http+socket server
server.listen(httpPort)
app.use(express.static('client'))

//Rooms
var roomManager = new RoomManager()

//Setting a socket behavior
io.on('connection', function(socket) {
	//We need to register the client somehow 
	socket.on('reg', function(name) {
		var token = jwt.sign({ name, id: socket.id }, jwtSecretKey);
		socket.emit('reg-success', token, 'main')

		//example
		console.log(token.substr(0, 5) + " connected to main")
		example(socket)
	})

	//If client is registered already and, for example, refreshed a page, we don't need to register him second time
	socket.on('verifyToken', function(token) {
		var good = true
		try {
			var decoded = jwt.verify(token, jwtSecretKey);
		} catch(err) {
			good = false
		}

		if(good) {
			socket.emit('reg-success', token, 'main')
			console.log(token.substr(0, 5) + " connected to main") //example
		}
	})
})

function example(socket) {
	let id = roomManager.createRoom()
	setTimeout(() => {
		roomManager.rerouteSocket(socket, id)
	}, 1000)
}