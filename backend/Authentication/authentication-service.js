module.exports = function(app, authConst) {
	var mysqlHandler  =  require('./mysql-handler')(app, authConst);
    var tokenHandler  =  require('./token-handler')(app, authConst);
	var authTools 	  =  require('./authentication-tools')(authConst);

	return {
		'checkEmailExistence': function(email){
			return mysqlHandler
			.retrieveUserByEmail(email)
			.then(function(rows) {
				if(rows.length > 0) {
			   		throw authConst.EMAIL_IN_USE;
				}
			});
		},
		'checkUsernameExistence': function(username) {
			return mysqlHandler
				.retrieveUserByUsername(username)
				.then(function(rows) {
					if(rows.length > 0) {
						throw authConst.USERNAME_IN_USE;
					}
				});
		},
		'loginUser': function(header, res) {
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

					var id 		 = rows[0].user_id,
						username = rows[0].username,
						password = rows[0].password,
						email    = rows[0].email;
					if(!authTools.checkPasswords(credentials[1], password)) {
						throw authConst.BAD_CREDENTIALS;
					} 
					var token = tokenHandler.generateToken({id: id,
				                                        	username: username,
				                                        	email: email});
					res.writeHead(authConst.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		'registerUser': function(data, res) {
			data.account_status = 'INACTIVE';
			data.password = authTools.hashPassword(data.password);
			return mysqlHandler
				.saveUser(data)
				.then(function(data) {
					var token = tokenHandler.generateToken({id: data.insertedId,
															username: data.username,
			                                        		email: data.email});
					//authTools.sendActivationLink(data);
					res.writeHead(authConst.OK, {'X-Auth-Token': token});
					res.end();
				});
		},
		'logoutUser': function() {

		}
	}
};