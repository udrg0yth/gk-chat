module.exports = function(app) {
	var authConst 	  =  require('./authentication-constants')();
	var corsFilter    =  require('./cors-filter')(app, authConst);
	var authService   =  require('./authentication-service')(app, authConst);
  
  	app.post(authConst.verifyTokenUrl, function(req, res) {
		var data = req.body;
		if(!authService.verifyToken(data.token)) {
			return res.status(authConst.UNAUTHORIZED).json({error : authConst.BAD_CREDENTIALS.message});
		}
		res.status(authConst.OK).json({success: true});
  	});

  	app.post('/uploadQuestion', function(req, res) {
  		var data = req.body;
  		authService.saveQuestion(data, res)
  		.catch(function(error) {
  			res.status(401).json({});
  		});
  	});

    app.post(authConst.usernameCheckUrl, function(req, res) {
    	var data = req.body;
    	if(!data.username){
    		return res.status(authConst.UNAUTHORIZED).json({error : authConst.INCOMPLETE_DATA.message});
    	}
    	authService
    	.checkUsernameExistence(data.username)
		.then(function(rows) {
			if(rows.length > 0) {
				res.status(authConst.UNAUTHORIZED).json({error : authConst.USERNAME_IN_USE.message});
			} else {
				res.status(authConst.OK).json({success : true});
			}
		})
    	.catch(function(error) {
    		res.status(authConst.UNAUTHORIZED).json({error : error});
    	});
    	
    });

    app.post(authConst.emailCheckUrl, function(req, res) {
    	var data = req.body;
    	if(!data.email){
    		return res.status(authConst.UNAUTHORIZED).json({error : authConst.INCOMPLETE_DATA.message});
    	}

    	authService
    	.checkEmailExistence(data.email)
    	.then(function(rows) {
			if(rows.length > 0) {
		   		res.status(authConst.UNAUTHORIZED).json({error : authConst.EMAIL_IN_USE.message});
			} else {
    			res.status(authConst.OK).json({success : true});
			}
		})
    	.catch(function(error) {
	    	res.status(authConst.UNAUTHORIZED).json({error : error});
    	});
    });

	app.get(authConst.loginUrl, function(req, res) {
		var header = req.headers.authorization;
		if(!header) {
			return res.status(authConst.UNAUTHORIZED).json({error : authConst.BAD_CREDENTIALS.message});
		}
		authService.loginUser(header, res)
		.catch(function(error){
			res.status(authConst.UNAUTHORIZED).json({error : error});
		});
	});

	app.post(authConst.registrationUrl, function(req, res) {
		var data = req.body;
		if(!data.password 
		|| !data.email) {
			return res.status(authConst.UNAUTHORIZED).json({error : authConst.BAD_CREDENTIALS.message});
		}
		
		authService.registerUser(data, res)
		.catch(function(error){
			res.status(authConst.INTERNAL_ERROR).json({error : error});
		});
	});

	app.get(authConst.logoutUrl, function(req, res) {
		authService
		.logoutUser()
		res.status(authConst.OK).json({});
	});
    
};