    var express     =  require('express'),
        bodyParser  =  require('body-parser'),
        app         =  express(),
        fs          = require('fs');
        HashMap     = require('hashmap'),
        uuid = require('node-uuid');


    var socketQueue = new HashMap();
        
    var corsOptions = {
        origin : 'localhost'  //digital ocean server ip
    }

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));

    var signConst = require('./signaling-constants')();
    var getRemoteUserModel = function(data) {
        return {
            iq: data.iqScore,
            gk: data.gkScore,
            p: data.personality,
            g: data.gender,
            bd: data.age
        };
    };

    require('./cors-filter')(app);
    require('./signaling-service')(app, signConst);

    var options = {
        key: fs.readFileSync('C:/Clone/newkey.pem'),
        cert: fs.readFileSync('C:/Clone/cert.pem')
    };


    var https = require('https').createServer(options, app).listen(8081, function(){
      console.log("Express server listening on port " + 8081);
    });

    var socketio    = require('socket.io')(https);


    socketio.on('connection', function (socket) {
        var userId = uuid.v1(),
            info = socket.handshake.query;
        info.socket = socket;

        if(socketQueue.count() == 0) {
             socketQueue.set(userId, info);
        } else {
             var roomID = uuid.v1(),
                 queuedInfo = socketQueue.get(socketQueue.keys()[socketQueue.keys().length-1]);

    		 socketQueue.remove(socketQueue.keys()[socketQueue.keys().length-1]);

             socket.join(roomID);
             queuedInfo.socket.join(roomID);
             socketio.in(roomID).emit('joinedRoom', {roomID: roomID}); 
    		 socket.to(roomID).emit('owner', {
                roomMaster: true, 
                remote: getRemoteUserModel(queuedInfo)
             });
    		 queuedInfo.socket.to(roomID).emit('owner', {
                roomMaster: false,
                remote: getRemoteUserModel(info)
             });
        }
        socket.on('message', function (message) {
            if(message.remoteOffer) {
                socket.broadcast.to(message.roomID).emit('remoteOffer', message);
            } else if(message.remoteAnswer) {
    			socket.broadcast.to(message.roomID).emit('remoteAnswer', message);
            } else if(message.offercandidate) {
    			socket.broadcast.to(message.roomID).emit('iceoffercandidate', message);
    		} else if(message.answercandidate) {
    			socket.broadcast.to(message.roomID).emit('iceanswercandidate', message);
    		}
        });
        socket.on('disconnect', function() {
            socketQueue.remove(userId);
        });
    });

    