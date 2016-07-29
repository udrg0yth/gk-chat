module.exports = function(application, authenticationConstants, genericConstants, tokenHandler, authMysqlHandler, genericTools) {
	var authenticationTools 	 =  require('./authentication-tools')(authenticationConstants),
		profileTools  			 =  require('./profile-tools')(authenticationConstants);

	var schedule = require('node-schedule'),
		statistics = {};

	var gatherStatistics = function() {
			authMysqlHandler
		  .gatherPersonalityStatistics()
		  .then(function(rows) {
		  	statistics.personalityStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.log('Error while gathering personality statistics!', error.message);
		  });

		    authMysqlHandler
		  .gatherGeneralKnowledgeStatistics()
		  .then(function(rows) {
		 	statistics.generalKnowledgeStatistics = rows[0];
		  })
		  .catch(function(error) {
			console.log('Error while gathering general knowledge statistics!', error.message);
		  });

		  	authMysqlHandler
		  .gatherIQStatistics()
		  .then(function(rows) {
		  	statistics.iqStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.log('Error while gathering IQ statistics!', error.message);
		  });

		  	authMysqlHandler
		  .gatherGenderStatistics()
		  .then(function(rows) {
		    statistics.genderStatistics = rows[0];
		  })
		  .catch(function(error) {
		    console.log('Error while gathering gender statistics!', error.message);
		  });
	};


	if( Object.keys(statistics).length === 0) {
		  gatherStatistics();
	}

	//should run every day!
	schedule.scheduleJob('1 * * * *', function(){
		  gatherStatistics();
	});

	return {
		getStatistics: function(res) {
			res.status(genericConstants.OK).json(statistics);
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
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', genericTools.encrypt(rows[0].user_id.toString()));
					authenticationTools.sendActivationLink(email, message);
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						message: authenticationConstants.BAD_CREDENTIALS.message
					});
				}
			});
		},
		activateAccount: function(hash, res) {
			var userId = genericTools.decrypt(hash);
			return authMysqlHandler
					.retrieveUserById(userId)
					.then(function(rows) {
						if(rows[0].account_status === 'ACTIVE') {
							res.status(genericConstants.UNAUTHORIZED).json({
								message: authenticationConstants.ACCOUNT_ALREADY_ACTIVE.message
							});
						} else {
							authMysqlHandler
						    .activateAccount(userId)
						    .then(function(rows) {
						    	res.status(genericConstants.OK).json({});
							})
							.catch(function(error) {
								res.status(genericConstants.INTERNAL_ERROR).json({
									message: error.message,
									trace: 'A-SCE-AA'
								});
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
							message: authenticationConstants.BAD_CREDENTIALS.message
						});
					}
					if(rows[0].account_status === 'INACTIVE') {
						return res.status(genericConstants.UNAUTHORIZED).json({
							message: authenticationConstants.INACTIVE_ACCOUNT.message
						});
					} else {
						if(!rows[0].username) {
							return res.status(genericConstants.UNAUTHORIZED).json({
								message: authenticationConstants.INCOMPLETE_PROFILE.message
							});
						} 
					}

					if(!authenticationTools.checkPasswords(credentials[1], rows[0].password)) {
						return res.status(genericConstants.UNAUTHORIZED).json({
							message: authenticationConstants.BAD_CREDENTIALS.message
						});
					} 
					var token = tokenHandler.generateToken(rows[0]);
					res.writeHead(genericConstants.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		registerUser: function(header, sendEmail, res) {
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
						var encryptedId = genericTools.encrypt(data.insertId.toString()),
							message = 
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', encryptedId);
						if(sendEmail) {
							authenticationTools.sendActivationLink(user[0].email, message);
							res.status(genericConstants.OK).json({});
						} else {
							res.status(genericConstants.OK).json({
								hash: encryptedId
							});
						}
					})
					.catch(function(error) {
						return res.status(genericConstants.INTERNAL_ERROR).json({
							message: error.message,
							trace: 'A-SCE-R'
						});
					});
				});
		},
		setUserProfile: function(data, res) {
				var userId = genericTools.decrypt(data.hash);
				delete data.hash;
				return authMysqlHandler
					.setUserProfile(userId, data)
					.then(function(rows) {
						var token = tokenHandler.generateToken(rows[0]);
						res.writeHead(genericConstants.OK, {'X-Auth-Token': token});
						res.end();
					});
		},
		getHash: function(email, res) {
			return authMysqlHandler
			.getIdFromEmail(email)
			.then(function(rows) {
				if(rows.length === 0) {
					return res.status(genericConstants.UNAUTHORIZED).json({
						message: authenticationConstants.BAD_CREDENTIALS.message
					});
				}

				res.status(genericConstants.OK).json({
					hash: genericTools.encrypt(rows[0].user_id.toString())
				});
			});
		},
		checkHash: function(hash, res) {
			var userId = genericTools.decrypt(hash);
			return authMysqlHandler
			.checkProfileCompletionById(userId)
			.then(function(rows) {
				if(rows.length === 0 || (rows.length > 0 && rows[0].username)) {
					return res.status(genericConstants.UNAUTHORIZED).json({
						message: genericConstants.BAD_DATA.message
					});
				} 

				res.status(genericConstants.OK).json({});
			});
		},
		logoutUser: function() {
		}
	}
};