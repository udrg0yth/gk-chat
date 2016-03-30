angular.module('chatModule').constant('chatConstant', {
	'signalingServerUrl' : 'https://socket-test-app.herokuapp.com/',
	'ICEConfig': {
					iceServers: [  
									{
										urls:'stun:stun.l.google.com:19302'
									},
                                    {
	                                   'url': 'turn:numb.viagenie.ca:3478?transport=udp',
	                                   'credential': '',
	                                   'username': 'vladradu97150@hotmail.com'
                                 	},
                                	{
	                                   'url': 'turn:numb.viagenie.ca:3478?transport=tcp',
	                                   'credential': '',
	                                   'username': 'vladradu97150@hotmail.com'
                                 	}	
                                ]
                 };
	'ICEOptions': { 
					optional: [
									{
										'DtlsSrtpKeyAgreement': true
									}
							   ] 
				  };
});