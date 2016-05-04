module.exports = function(app, authConst) {
	var mysqlHandler  =  require('./mysql-handler')(app, authConst);
    var tokenHandler  =  require('./token-handler')(app, authConst);
	var authTools 	  =  require('./authentication-tools')(authConst);
	var profileTools  =  require('./profile-tools')(authConst);

	return {
		checkEmailExistence: function(email){
			 mysqlHandler
			.retrieveUserByEmail(email)
			.then(function(rows) {
				if(rows.length > 0) {
			   		throw authConst.EMAIL_IN_USE;
				}
			})
			.catch(function(error) {

			});
		},
		checkUsernameExistence: function(username) {
		     mysqlHandler
			.retrieveUserByUsername(username)
			.then(function(rows) {
				if(rows.length > 0) {
					throw authConst.USERNAME_IN_USE;
				}
			})
			.catch(function(error) {
			
			});
		},
		resendActivationMail: function(userId) {
			 mysqlHandler
		    .retrieveUserById(userId)
		    .then(function(rows) {
				authTools.sendActivationLink(rows[0]);
			})
			.catch(function(error) {
			
			});
		},
		loginUser: function(header, res) {
			var credentials = authTools.getCredentials(header);

			return mysqlHandler
				.retrieveUserByEmail(credentials[0])
				.then(function(rows) {
					if(rows.length === 0) {
						throw authConst.BAD_CREDENTIALS;
					}
					if(rows.account_status === 'INACTIVE') {
						throw authConst.INACTIVE_ACCOUNT;
					}

					if(!authTools.checkPasswords(credentials[1], rows[0].password)) {
						throw authConst.BAD_CREDENTIALS;
					} 
					var token = tokenHandler.generateToken({id:           rows[0].user_id,
				                                        	username:     rows[0].username,
				                                            gender:       rows[0].gender,
				                                        	birthdate:    rows[0].birthdate,
				                                        	credits:      rows[0].credits,
				                                        	personality:  rows[0].current_personality,
				                                            iqScore:      profileTools.computeIq(rows[0]),
				                                            gkScore:      profileTools.computeGeneralKnowledge(rows[0])
				                                          });
					res.writeHead(authConst.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		registerUser: function(data, res) {
			data.password = authTools.hashPassword(data.password);
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
			                                        		gkScore:      profileTools.computeGeneralKnowledge(data)
			                                        	  });
					authTools.sendActivationLink(data);
					res.writeHead(authConst.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		logoutUser: function() {
		},
		verifyToken: function(token) {
			return tokenHandler.verifyToken(token);
		}
	}
};