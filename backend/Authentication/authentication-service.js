module.exports = function(application, authenticationConstants, genericConstants, tokenHandler, authMysqlHandler) {
	var authenticationTools 	 =  require('./authentication-tools')(authenticationConstants),
		profileTools  			 =  require('./profile-tools')(authenticationConstants);

	return {
		getStatistics: function(res) {
			res.status(genericConstants.OK).json(authMysqlHandler.getStatistics());
		},
		verifyToken: function(token) {
			return tokenHandler.verifyToken(token);
		},
		checkEmailExistence: function(email){
			return authMysqlHandler
			.retrieveUserByEmail(email);

		},
		checkUsernameExistence: function(username) {
		    return authMysqlHandler
			.retrieveUserByUsername(username);
		},
		resendEmail: function(email, res) {
			return authMysqlHandler
		    .retrieveUserByEmail(email)
		    .then(function(rows) {
				if(rows.length > 0) {
					var message = 
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', authenticationTools.encrypt(rows[0].user_id.toString()));
					authenticationTools.sendActivationLink(email, message);
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						error: authenticationConstants.BAD_CREDENTIALS.message
					});
				}
			});
		},
		activateAccount: function(hash, res) {
			var userId = authenticationTools.decrypt(hash);
			return authMysqlHandler
					.retrieveUserById(userId)
					.then(function(rows) {
						if(rows[0].account_status === 'ACTIVE') {
							res.status(genericConstants.UNAUTHORIZED).json({
								error: authenticationConstants.ACCOUNT_ALREADY_ACTIVE.message
							});
						} else {
							authMysqlHandler
						    .activateAccount(userId)
						    .then(function(rows) {
						    	res.status(genericConstants.OK).json({});
							});
						}
					});
		},
		loginUser: function(header, res) {
			var credentials = authenticationTools.getCredentials(header);

			return authMysqlHandler
				.retrieveUserByEmail(credentials[0])
				.then(function(rows) {
					if(rows.length === 0) {
						return res.status(genericConstants.UNAUTHORIZED).json({
							error: authenticationConstants.BAD_CREDENTIALS.message
						});
					}
					if(rows[0].account_status === 'INACTIVE') {
						return res.status(genericConstants.UNAUTHORIZED).json({
							error: authenticationConstants.INACTIVE_ACCOUNT.message
						});
					} else {
						if(!rows[0].username) {
							return res.status(genericConstants.UNAUTHORIZED).json({
								error: authenticationConstants.INCOMPLETE_PROFILE.message
							});
						} 
					}

					if(!authenticationTools.checkPasswords(credentials[1], rows[0].password)) {
						return res.status(genericConstants.UNAUTHORIZED).json({
							error: authenticationConstants.BAD_CREDENTIALS.message
						});
					} 
					var token = tokenHandler.generateToken({id: rows[0].user_id});

					res.writeHead(genericConstants.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		registerUser: function(header, res) {
			var credentials = authenticationTools.getCredentials(header),
			data = {
				email: credentials[0],
				password: authenticationTools.hashPassword(credentials[1]),
				accountStatus: 'INACTIVE'
			};

			return authMysqlHandler
				.registerUser(data)
				.then(function(data) {
					authMysqlHandler
					.retrieveUserById(data.insertId)
					.then(function(user) {
						var encryptedId = authenticationTools.encrypt(data.insertId.toString()),
							message = 
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', encryptedId);
						console.log(authenticationTools.encrypt(data.insertId.toString()));
						authenticationTools.sendActivationLink(user[0].email, message);
						
					});
					res.status(genericConstants.OK).json({});
				});
		},
		setUserProfile: function(data, res) {
				var userId = authenticationTools.decrypt(data.hash);
				delete data.hash;
				return authMysqlHandler
					.setUserProfile(userId, data)
					.then(function() {
						res.status(genericConstants.OK).json({});
					});
		},
		logoutUser: function() {
		}
	}
};