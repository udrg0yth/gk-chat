module.exports = function(app, signConst) {
		var http = require('http'),
			constructOptions = function(path, method, data) {
				var options = {
					host: signConst.authorizationBaseUrl,
					path: path,
					port: signConst.authorizationPort
				};
				if(method === 'POST') {
					options.method = 'POST';
					options.headers = {
				        'Content-Type': 'application/json',
				        'Content-Length': Buffer.byteLength(data)
				    };
				}
				return options;
			};

		return {
			checkToken: function(token) {
				var data = {
					token:token
				},
				req = http.request(
					constructOptions(signConst.checkTokenUrl,'POST', data) , function(res) {
						res.setEncoding('utf8');
					    res.on('data', function (chunk) {
					        if(chunk.success) {

					        } else if(chunk.error) {

					        }
					    });
				});
				req.write(data);
				req.end();
			},
			sustractCredits: function(userId, credits) {
				req = http.request(
					constructOptions(signConst.sustractCreditsUrl,'POST', data) , function(res) {
						res.setEncoding('utf8');
					    res.on('data', function (chunk) {
					        if(chunk.success) {
					        	
					        } else if(chunk.error) {

					        }
					    });
				});
			}
		};
};