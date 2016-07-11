module.exports = function(application, authenticationConstants, genericConstants) {
	var mysqlHandler 			 =  require('./mysql-handler')(genericConstants);
    var tokenHandler 			 =  require('./token-handler')(application, authenticationConstants, genericConstants);
	var authenticationTools 	 =  require('./authentication-tools')(authenticationConstants);
	var profileTools  			 =  require('./profile-tools')(authenticationConstants);

	return {
		verifyToken: function(token) {
			return tokenHandler.verifyToken(token);
		},
		checkEmailExistence: function(email){
			return mysqlHandler
			.retrieveUserByEmail(email);

		},
		checkUsernameExistence: function(username) {
		    return mysqlHandler
			.retrieveUserByUsername(username);
		},
		resendEmail: function(email, res) {
			return mysqlHandler
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
			return mysqlHandler
					.retrieveUserById(userId)
					.then(function(rows) {
						if(rows[0].account_status === 'ACTIVE') {
							res.status(genericConstants.UNAUTHORIZED).json({
								error: authenticationConstants.ACCOUNT_ALREADY_ACTIVE.message
							});
						} else {
							mysqlHandler
						    .activateAccount()
						    .then(function(rows) {
						    	res.status(genericConstants.OK).json({});
							});
						}
					});
		},
		saveQuestion: function(question, res) {
			 return mysqlHandler
		    .saveQuestion(question)
		    .then(function(rows) {
				res.status(genericConstants.OK).json({});
			});
		},
		loginUser: function(header, res) {
			var credentials = authenticationTools.getCredentials(header);

			return mysqlHandler
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
		/*registerUser: function(data, res) {
			data.password = authenticationTools.hashPassword(data.password);
			data.account_status = 'INACTIVE';

			return mysqlHandler
				.saveUser(data)
				.then(function(data) {
					var token = tokenHandler.generateToken({id:           data.insertedId,
															username:     data.username,
			                                        		gender:       data.gender,
			                                        		birthdate:    data.birthdate,
			                                        		credits:      data.credits,
			                                        		personality:  data.current_personality,
			                                        		iqScore:      profileTools.computeIq(data),
			                                        		gkScore:      profileTools.computeGeneralKnowledge(data)});
					authenticationTools.sendActivationLink(data);
					res.writeHead(genericConstants.OK, {'X-Auth-Token': token});
					res.end();
				});
		},*/
		registerUser: function(header, res) {
			var credentials = authenticationTools.getCredentials(header),
			data = {
				email: credentials[0],
				password: authenticationTools.hashPassword(credentials[1]),
				accountStatus: 'INACTIVE'
			};

			return mysqlHandler
				.registerUser(data)
				.then(function(data) {
					mysqlHandler
					.retrieveUserById(data.insertId)
					.then(function(user) {
						var message = 
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', authenticationTools.encrypt(data.insertId.toString()));
						console.log(user[0]);
						authenticationTools.sendActivationLink(user[0].email, message);
						
					});
					res.status(genericConstants.OK).json({});
				});
		},
		logoutUser: function() {
		}
	}
};