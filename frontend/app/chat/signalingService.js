angular.module('chatModule').service('signalingService', ['$http', '$localStorage', 'chatConstant', function($http, $localStorage, chatConstant) {
	var self = this,
		user = {},
		iosocket = io.connect(chatConstant.signalingServerUrl, {reconnection: false}),
		localDevice = new RTCPeerConnection(chatConstant.ICEConfig, chatConstant.ICEOptions),
		remoteDevice = new RTCPeerConnection(chatConstant.ICEConfig, chatConstant.ICEOptions),
		offerDescription = null,
		answerDescription = null,
		localDataChannel = null,
		remoteDataChannel = null,
		activeDataChannel = null,

		createLocalOffer = function() {
			setupLocalDatachannel();
			localDevice.createOffer(function(description) {
				localDevice.setLocalDescription(description);
				iosocket.send({
					roomID: user.roomID,
					remoteOffer: JSON.stringify(description)
				});
			}, function(error) {
				console.log(error);
			});
		},
		
		handleRemoteOffer = function(remoteOffer) {
			remoteDevice.setRemoteDescription(remoteOffer);
			remoteDevice.createAnswer(function(description) {
				remoteDevice.setLocalDescription(description);
				iosocket.send({
					roomID: user.roomID, 
					remoteAnswer: JSON.stringify(description)
				});
			}, function(error) {
				console.log(error);
			});
		},

		handleRemoteAnswer = function(remoteAnswer) {
			localDevice.setRemoteDescription(remoteAnswer);
		},

		localDeviceOnICE = function(event) {
			if(event.candidate != null) {
				iosocket.send({
					roomID: user.roomID, 
					offercandidate: JSON.stringify(event.candidate)
				});
			}
		},

		remoteDeviceOnICE = function(event) {
			if(event.candidate != null) {
				iosocket.send({
					roomID: user.roomID, 
					answercandidate: JSON.stringify(event.candidate)
				});
			}
		},

		setupLocalDatachannel = function() {
			try {
				localDataChannel = localDevice.createDataChannel(user.roomID, {reliable:true});
				activeDataChannel = localDataChannel;

				localDataChannel.onopen = function(event) {
					console.log('connected ', event);
				}

				localDataChannel.onmessage = function(event) {
					console.log('got message ', event.data);
				}
			} catch(error) {
				console.log(error);
			}
		},

		setUp = function(callback) {
			iosocket.on('remoteOffer', function(data) {
	              offerDesc = new RTCSessionDescription(JSON.parse(data.remoteOffer));
	              handleRemoteOffer(offerDescription);
				  callback(user);
	        });

	        iosocket.on('remoteAnswer', function(data) {
	              answerDesc = new RTCSessionDescription(JSON.parse(data.remoteAnswer));
	              localDevice.setRemoteDescription(answerDesc);
	              callback(user);
	        });
		},

		signalingStateChangeHandler = function(state) {
			console.info('Signaling state change: ', state);
		},

		ICEConnectionStateChangeHandler = function(state) {
			console.info('ICE connection state change: ', state);
		},

		ICEGatteringStateChangeHandler = function(state) {
			console.info('ICE gattering state change: ', state);
		};

	localDevice.onincecandidate = localDeviceOnICE;
	localDevice.onsignalingstatechange = signalingStateChangeHandler;
	localDevice.oniceconnectionstatechange = ICEConnectionStateChangeHandler;
	localDevice.onicegatteringstatechange = ICEGatteringStateChange;

	remoteDevice.onincecandidate = remoteDeviceOnICE;
	remoteDevice.onsignalingstatechange = signalingStateChangeHandler;
	remoteDevice.oniceconnectionstatechange = ICEConnectionStateChangeHandler;
	remoteDevice.onicegatteringstatechange = ICEGatteringStateChange;

	iosocket.on('owner', function(data){
        if(data.roomMaster === true) {
			 user.master = true;
			 user.userDetails = data.userDetails;	        	
             createLocalOffer();
        } 
	});

	iosocket.on('joinedRoom', function(data) {
              user.roomID = data.roomID;
    });

    self.createConnection = function(callback) {
			iosocket.on('connect', function() {
				setUp(callback);
			});
	};

    self.send = function(message) { // message is json
        activeChannel.send(JSON.stringify(message));
    };


}]);