module.exports = function(app) {


    var HashMap     = require('hashmap');
    var http        = require('http').Server(app);
    var socketio    = require('socket.io')(http);
    var socketQueue = new HashMap();
    var uuid = require('node-uuid');

    socketio.on('connection', function (socket) {
        if(socketQueue.count() == 0) {
             socketQueue.set(uuid.v1(), socket);
        } else {
             var queuedSocket = socketQueue.get(socketQueue.keys()[socketQueue.keys().length-1]);
    		 socketQueue.remove(socketQueue.keys()[socketQueue.keys().length-1]);
             var roomID = uuid.v1();
             socket.join(roomID);
             queuedSocket.join(roomID);
             socketio.in(roomID).emit('joinedRoom', {roomID: roomID}); 
    		 socket.to(roomID).emit('owner', {'roomMaster': true});
    		 queuedSocket.to(roomID).emit('owner', {'roomMaster': false});
        }
        socket.on('message', function (message) {
            if(message.remoteOffer) {
    			console.log('Sent remote offer');
                socket.broadcast.to(message.roomID).emit('remoteOffer', message);
            } else if(message.remoteAnswer) {
    			console.log('Sent remote answer');
    			socket.broadcast.to(message.roomID).emit('remoteAnswer', message);
            } else if(message.offercandidate) {
    			console.log('sent offer candidate');
    			socket.broadcast.to(message.roomID).emit('iceoffercandidate', message);
    		} else if(message.answercandidate) {
    			socket.broadcast.to(message.roomID).emit('iceanswercandidate', message);
    		}
        });
    });

    http.listen(8083, function(){
      console.log('listening on *:8081');
    });

};