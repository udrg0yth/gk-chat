module.exports = function(authenticationConstants) {
	var passwordHash = require('password-hash'),
	    nodemailer = require('nodemailer'),
	    crypto = require('crypto'),
	    transporter = nodemailer.createTransport({
       		    service: 'Gmail',
		        auth: {
		            user: 'vladradu97150@gmail.com',
		            pass: 'vladradu1995'
		        }
		});

	return {
		hashPassword: function(rawPass) {
			return passwordHash.generate(rawPass);
		},
		checkPasswords: function(rawPass, encPass) {
			return passwordHash.verify(rawPass, encPass);
		},
		getCredentials: function(header) {
			var buffer = new Buffer(header, 'Base64');
			var credentials = buffer
							.toString()
							.split(':');
			if(credentials.length != 2) {
				throw authConst.BAD_CREDENTIALS;
			}
			return credentials;
		},
		sendActivationLink: function(to, message) {
		    var mailOptions = {
			    from: 'vladradu97150@gmail.com',
			    to: to,
			    subject: 'Randomette confirmation',
			    html: message
			};

			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			    };
			});
		},
		encrypt: function(text) {
			  var cipher = crypto.createCipher(authenticationConstants.CRYPTO_ALGORITHM ,authenticationConstants.CRYPTO_SECRET),
			  	  crypted = cipher.update(text,'utf8','hex');
			  crypted += cipher.final('hex');
			  return crypted;
		},
		decrypt: function(text) {
			  var decipher = crypto.createDecipher(authenticationConstants.CRYPTO_ALGORITHM ,authenticationConstants.CRYPTO_SECRET),
			  	  dec = decipher.update(text,'hex','utf8');
			  dec += decipher.final('utf8');
			  return dec;
		}
	}
}