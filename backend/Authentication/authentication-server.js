module.exports = function(app) {
	var authConst 	  =  require('./authentication-constants')();
    var mysqlHandler  =  require('./mysql-handler')(app, authConst);
    var tokenHandler  =  require('./token-handler')(app, authConst);
	var authTools 	  =  require('./authentication-tools')(authConst);

  
    app.post(authConst.usernameCheckUrl, function(req, res) {
    	var data = req.body;
    	if(!data.username){
    		return res.status(authConst.UNAUTHORIZED).json({error : authConst.INCOMPLETE_DATA});
    	}
    	mysqlHandler
		.retrieveUserByUsername(data.username)
		.then(function(rows) {
			if(rows.length === 0) {
		   		res.status(authConst.CONFLICT).json({error : authConst.USERNAME_IN_USE});
			}
		});
    });

    app.post(authConst.emailCheckUrl, function(req, res) {
    	var data = req.body;
    	if(!data.email){
    		return res.status(authConst.UNAUTHORIZED).json({error : authConst.INCOMPLETE_DATA});
    	}
    	mysqlHandler
		.retrieveUserByEmail(data.email)
		.then(function(rows) {
			if(rows.length === 0) {
		   		res.status(authConst.CONFLICT).json({error : authConst.EMAIL_IN_USE});
			}
		});
    });

	app.post(authConst.loginUrl, function(req, res) {
		var header = req.headers['Authorization'];
		if(!header){
			return res.status(authConst.UNAUTHORIZED).json({error : authConst.BAD_CREDENTIALS});
		}
		var credentials = authTools.getCredentials(header);

		mysqlHandler
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
				password = rows[0].password;

			if(!authTools.checkPasswords(password, credentials[1])) {
				throw authConst.BAD_CREDENTIALS;
			} 

			var token = tokenHandler.generateToken({id: id,
			                                        username: username,
			                                        email: email});
			res.writeHead(authConst.OK, {'X-Auth-Token': token});
			res.end();
		})
		.catch(function(error){
			res.status(authConst.UNAUTHORIZED).json({error : error});
		});
	});

	app.post(authConst.registrationUrl, function(req, res) {
		var data = req.body;
		if(!data.username 
		|| !data.password 
		|| !data.email) {
			return res.status(authConst.UNAUTHORIZED).json({error : authConst.BAD_CREDENTIALS});
		}
		data.account_status = 'INACTIVE';
		mysqlHandler
		.saveUser(data)
		.then(function() {
			authTools.sendActivationLink(data);
		})
		.catch(function(error){
			res.status(authConst.INTERNAL_ERROR).json({error : error});
		});
	});

	app.post(authConst.logoutUrl, function(req, res) {
		res.status(authConst.OK).json({});
	});
    
};