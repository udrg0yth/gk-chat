module.exports = function(authConst) {
	var passwordHash = require('password-hash'),
	    nodemailer = require('nodemailer'),
	    transporter = nodemailer.createTransport({
       		    service: 'Gmail',
		        auth: {
		            user: 'chat.dev.group@gmail.com',
		            pass: 'randomette'
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
		sendActivationLink: function(user) {
		    var mailOptions = {
			    from: 'chat.dev.group@gmail.com>',
			    to: user.email,
			    subject: 'Randomette confirmation',
			    text: 'test'
			    // html: '<b>Hello world</b>' // for html!
			};

			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			        console.log('Message sent: ' + info.response);
			    };
			});
		}
	}
}