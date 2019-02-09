# Room clusters template  
This is a template for creating a Node.js server, that supports several running additional parallel servers (I call them rooms), routing users between them and tries to be efficient and stable  
Where you can apply this to?  
Almost any game with rooms/parties/different servers, or to multithread some computations. Anything with multithreading will do  

## Installing  
Just clone this repo, this is **not** a library, this is a project template  
And don't forget to run `npm install`

## Usage  
This is actually a template with some basic example, so you can run it and watch client side and server side logs  
Basically, you can add/edit/replace anything, but I think, that you shouldn't edit basic structure  
There are 4 main files:  
1. `server.js`  
This is your main server, that responsible for showing you your html pages, routing users and not doing the hardwork  
With a game example, this is your lobby, main menu, where players only choose game modes and servers, and waiting for game to start  
2. `room.js`  
This is your additional server file, that responsible for doing the hardwork  
It can be a game server, some big computations and interface to them, or just your logic server for routing users from 1 thread to several  
3. `client.js`  
This is your client file, there are two main callbacks - on `reroute` and on `room disconnect`. I recommend not editing them, or edit with understanding of what you doing  
4. `room_manager.js`  
Name speaks for itself. I didn't add a room exit callbacks, that and other callbacks, I guess, is the only thing you probably need to add  

## How must it work  
Firstly, client connects to the main server. Then, you can register him, give him a token, with which you will do all other things (do not hope for socket.id, etc.)  
Then, somewhere and somehow, your server decides to move the client to an additional server (for example, the game started)  
Then, your additional server can drop connection and/or stop executing, and the client will connect to the main server  
If the client lost connection somewhere, **it will connect to the main server regardless it previous state**. I thought this is the best way almost in every situation. If you need to connect client again to the additional server, you just do it  

## Working stack  
For server:  
* Node.js as platform  
* socket.io for communication  
* JsonWebToken for generating tokens for users. Feel free to choose any equivalent  

For client:  
* socket.io for communication
* js-cookie for easy cookie editing