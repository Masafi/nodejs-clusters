//Consts

//Your secret key for encoding tokens
const jwtSecretKey = 'your secret key'
//HTTP port for main and http server
const httpPort = 80
//Path to a child module (room module)
const moduleName = 'server/room.js'
//Port, from which to start
//i.e. room with id, will have port = (basicPort + id)
const basicPort = 10000

module.exports = {jwtSecretKey, httpPort, moduleName, basicPort}