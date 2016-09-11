angular.module('chatModule').service('signalingService', ['$http', '$localStorage', 'chatConstant',  function($http, $localStorage, chatConstant) {
this.getSignalingServer = function(localUser) {
			var self = this,
				user = {},
				iosocket = null,
				candidates = [],
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
							self.callback(self.remoteUser);
							console.log('connected ', event);
						}

						localDatachannel.onmessage = function(event) {
							self.mesCallback(event.data);
						}
					} catch(error) {
						console.log(error);
					}
				},

				remoteDeviceOnDatachannelHandler = function(event) {
		      		remoteDatachannel = event.channel || event;
		      		activeDatachannel = remoteDatachannel;

		      		remoteDatachannel.onopen = function (event) {
		      			self.callback(self.remoteUser);
		            	console.log('Datachannel connected!');
		      		};

		      		remoteDatachannel.onmessage = function (event) {
		          		self.mesCallback(event.data);
		      		};
		   		},

				setUp = function() {
					iosocket.on('remoteOffer', function(data) {
			              offerDescription = new RTCSessionDescription(JSON.parse(data.remoteOffer));
			              handleRemoteOffer(offerDescription);
			        });

			        iosocket.on('remoteAnswer', function(data) {
			              answerDescription = new RTCSessionDescription(JSON.parse(data.remoteAnswer));
			              handleRemoteAnswer(answerDescription);
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

			

		    return {
		    	createConnection: function(callback) {
		    		self.callback = callback;
		    		iosocket = io.connect(chatConstant.signalingServerUrl, {
						query: {
							iqScore: localUser.iq,
							gkScore:  localUser.gk,
							personality: localUser.p,
							age: localUser.bd,
							gender: localUser.g
						}
					}),
		    		iosocket.on('connect', function() {
		    			console.log('connected');
						setUp();
					});

					iosocket.on('owner', function(data){
						self.remoteUser = data.remote;
				        if(data.roomMaster === true) {
							 user.master = true;        	
				             createLocalOffer();
				        }
					});

					iosocket.on('joinedRoom', function(data) {
				              user.roomID = data.roomID;
				    });
		    	},
		    	send: function(message) {
		    		activeDatachannel.send(message);
		    	},
		    	onMessage: function(callback) {
		    		self.mesCallback = callback;
		    	}
		    };
	};


}]);