angular.module('chatModule').service('signalingService', ['$http', '$localStorage', 'chatConstant', function($http, $localStorage, chatConstant) {
	var self = this,
		user = {},
		candidates = [],
		iosocket = io.connect(chatConstant.signalingServerUrl, {reconnection: false}),
		localDevice = new RTCPeerConnection(chatConstant.ICEConfig, chatConstant.ICEOptions),
		remoteDevice = new RTCPeerConnection(chatConstant.ICEConfig, chatConstant.ICEOptions),
		offerDescription = null,
		answerDescription = null,
		localDatachannel = null,
		remoteDatachannel = null,
		activeDatachannel = null,
		remoteOfferSet = false,
		remoteAnswerSet = false,

		createLocalOffer = function() {
			setupLocalDatachannel();
			localDevice.createOffer(function(description) {
				console.log('Created local offer: ', description);
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
			console.log('Set remote offer');
			remoteOfferSet = true;
			remoteDevice.createAnswer(function(description) {
				console.log('Created local answer: ', description);
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
			console.log('Set remote answer');
			remoteAnswerSet = true;
		},

		localDeviceOnICE = function(event) {
			if(event.candidate != null) {
				console.log('Sending candidate: ', event.candidate);
				iosocket.send({
					roomID: user.roomID, 
					offercandidate: JSON.stringify(event.candidate)
				});
			}
		},

		remoteDeviceOnICE = function(event) {
			if(event.candidate != null) {
				console.log('Sending candidate: ', event.candidate);
				iosocket.send({
					roomID: user.roomID, 
					answercandidate: JSON.stringify(event.candidate)
				});
			}
		},

		setupLocalDatachannel = function() {
			try {
				localDatachannel = localDevice.createDataChannel(user.roomID, {reliable:true});
				activeDatachannel = localDatachannel;

				localDatachannel.onopen = function(event) {
					console.log('connected ', event);
				}

				localDatachannel.onmessage = function(event) {
					console.log('got message ', event.data);
				}
			} catch(error) {
				console.log(error);
			}
		},

		remoteDeviceOnDatachannelHandler = function(event) {
      		remoteDatachannel = event.channel || event;
      		activeDatachannel = remoteDatachannel;

      		remoteDatachannel.onopen = function (event) {
            	console.log('Datachannel connected!');
      		};

      		remoteDatachannel.onmessage = function (event) {
          		console.log(event.data);
      		};
   		};

		setUp = function(callback) {
			iosocket.on('remoteOffer', function(data) {
	              offerDescription = new RTCSessionDescription(JSON.parse(data.remoteOffer));
	              handleRemoteOffer(offerDescription);
				  callback(user);
	        });

	        iosocket.on('remoteAnswer', function(data) {
	              answerDescription = new RTCSessionDescription(JSON.parse(data.remoteAnswer));
	              handleRemoteAnswer(answerDescription);
	              callback(user);
	        });

	        var lastIceOfferCandidateCall = null,
          	 	offerTimer = setInterval(function() {
            		if(lastIceOfferCandidateCall != null) {
              			if(new Date() - lastIceOfferCandidateCall > 500) {
               				if(remoteAnswerSet 
               				&& candidates != null) {
                				for(var i=0;i<candidates.length;i++) {
                 					localDevice.addIceCandidate(candidates[i]);
                  					console.log('Added candidate! full arr');
                				}
                                candidates = null;
               				} else if(remoteAnswerSet 
               					   && candidates == null) {            
                			    clearInterval(offerTimer);
                            }
                        }
                    }
                },100),

                lastIceAnswerCandidateCall = null,
          		answerTimer = setInterval(function() {
            		if(lastIceAnswerCandidateCall != null) {
              			if(new Date() - lastIceAnswerCandidateCall > 500) {
                			if(remoteOfferSet 
                			&& candidates != null) {
                  				for(var i=0;i<candidates.length;i++) {
                   					remoteDevice.addIceCandidate(candidates[i]);
                   					console.log('Added candidate! full arr');
              					}
                  				candidates = null;
                			} else if(remoteOfferSet 
                				   && candidates == null) {            
                  				clearInterval(answerTimer);
                			}
              			}
            		}
          		},100);

          		iosocket.on('iceoffercandidate', function(data) {
              		lastIceAnswerCandidateCall = new Date();
              		if(data.offercandidate) {
                		if(remoteAnswerSet) {
                  			if(candidates != null) { 
                    			for(var i=0;i<candidates.length;i++) {
                      				remoteDevice.addIceCandidate(candidates[i]);
                    			}
                   			 	remoteDevice.addIceCandidate(new RTCIceCandidate(JSON.parse(data.offercandidate)));
                    			console.log('Added candidate! semi eve');
                    			candidates = null;
                  			}
                		} else {
                   			if(candidates != null) { 
                     			candidates.push(new RTCIceCandidate(JSON.parse(data.offercandidate)));
               				}
                		}
              		}
          		});

          		iosocket.on('iceanswercandidate', function(data) {
              		lastIceOfferCandidateCall = new Date();
          			if(data.answercandidate) {
                		if(remoteAnswerSet) {
                  			if(candidates != null) { 
                   				for(var i=0;i<candidates.length;i++) {
                      				localDevice.addIceCandidate(candidates[i]);
                    			}
                    			localDevice.addIceCandidate(new RTCIceCandidate(JSON.parse(data.answercandidate)));
                    			console.log('Added candidate! semi eve');
                    			candidates = null;
                  			}
                		} else {
                   			if(candidates != null) { 
                    			candidates.push(new RTCIceCandidate(JSON.parse(data.answercandidate)));
                   			}
                		}
              		} 
          		});
		},

		signalingStateChangeHandler = function(state) {
			//console.info('Signaling state change: ', state);
		},

		ICEConnectionStateChangeHandler = function(state) {
			//console.info('ICE connection state change: ', state);
		},

		ICEGatteringStateChangeHandler = function(state) {
			//console.info('ICE gattering state change: ', state);
		};


	localDevice.onicecandidate = localDeviceOnICE;
	localDevice.onsignalingstatechange = signalingStateChangeHandler;
	localDevice.oniceconnectionstatechange = ICEConnectionStateChangeHandler;
	localDevice.onicegatteringstatechange = ICEGatteringStateChangeHandler;

	remoteDevice.onicecandidate = remoteDeviceOnICE;
	remoteDevice.onsignalingstatechange = signalingStateChangeHandler;
	remoteDevice.oniceconnectionstatechange = ICEConnectionStateChangeHandler;
	remoteDevice.onicegatteringstatechange = ICEGatteringStateChangeHandler;

	remoteDevice.ondatachannel = remoteDeviceOnDatachannelHandler;

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