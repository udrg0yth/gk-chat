angular.module('chatModule').constant('chatConstant', {
	'signalingServerUrl' : 'http://localhost:8081',
	'ICEConfig': {
					iceServers: [  
									{
										urls:'stun:stun4.l.google.com:19302'
									},
                                    {
	                                   'url': 'turn:numb.viagenie.ca:3478?transport=udp',
	                                   'credential': 'corina01',
	                                   'username': 'vladradu97150@hotmail.com'
                                 	},
                                	{
	                                   'url': 'turn:numb.viagenie.ca:3478?transport=tcp',
	                                   'credential': 'corina01',
	                                   'username': 'vladradu97150@hotmail.com'
                                 	}	
                                ]
                 },
	'ICEOptions': { 
					optional: [
									{
										'DtlsSrtpKeyAgreement': true
									}
							   ] 
				  }
});