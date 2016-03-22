module.exports = function(authConst) {
	var passwordHash = require('password-hash');


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
			//encrypt username as activation string with private.key
		}
	}
}