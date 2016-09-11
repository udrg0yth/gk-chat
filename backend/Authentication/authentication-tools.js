module.exports = function(authenticationConstants) {
	var passwordHash = require('password-hash'),
	    nodemailer = require('nodemailer'),
	    transporter = nodemailer.createTransport(authenticationConstants.MAIL_SERVER);

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
				throw authenticationConstants.BAD_CREDENTIALS;
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
			        console.log('Message sent: ', info.response);
			    }
			});
		},
		computeAge: function(birthdate) {
			console.log('birthage', birthdate);
		    var ageDifMs = Date.now() - new Date(birthdate).getTime(),
		    	ageDate = new Date(ageDifMs);
		    	console.log(ageDifMs, ageDate, ageDate.getUTCFullYear());
		    return Math.abs(ageDate.getUTCFullYear() - 1970);
		}
	};
};