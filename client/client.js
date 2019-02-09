const IP = "http://localhost"

var mainSocket = io.connect(IP)
var roomSocket = undefined
var token = undefined
var isInMain = true

//Button callback
function register() {
	var name = document.getElementById("name")
	mainSocket.emit('reg', name)
}

//Utility function if needed
function getCurrentSocket() {
	return (isInMain ? mainSocket : roomSocket)
}

//App logic initialization
//Feel free to edit
function initSocket(socket) {
	socket.on('reg-success', function(tkn, id) {
		token = tkn
		Cookies.set('token', token)
		console.log("registered at " + id)
	})

	socket.on('connect', function() {
		token = Cookies.get('token')
		token && socket.emit('verifyToken', token)
	})
}

initSocket(mainSocket)

//Connection logic
//Responsible for switching from rooms and main server
//Be carefull to edit
mainSocket.on('reroute', function(port) {
	//Firstly, disconnect from main server
	//Optional
	mainSocket.disconnect()
	//Switch boolean variable
	isInMain = false
	//Connect to the room
	roomSocket = io.connect(IP + ':' + port, { reconnection: false })
	//Initialize logic
	initSocket(roomSocket);

	//When disconnects, force to connect to main server and not reconnect to the room
	roomSocket.on('disconnect', function() {
		isInMain = true
		mainSocket.connect();
	})
})