module.exports = function(application, genericConstants, tokenHandler, authMysqlHandler) {
	var authenticationConstants 	  	=  require('./authentication-constants')(),
		corsFilter    					=  require('./cors-filter')(application, authenticationConstants),
		authenticationService  		  	=  require('./authentication-service')(application, 
			authenticationConstants, genericConstants, tokenHandler, authMysqlHandler);
  
  	application.get(genericConstants.STATISTICS_URL, function(req, res) {
  		authenticationService.getStatistics(res);
  	});

  	application.post(genericConstants.VERIFY_TOKEN_URL, function(req, res) {
		var data = req.body;
		if(!authenticationService.verifyToken(data.token)) {
			return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.BAD_CREDENTIALS.message});
		}
		res.status(genericConstants.OK).json({success: true});
  	});

    application.post(genericConstants.USERNAME_CHECK_URL, function(req, res) {
    	var data = req.body;
    	if(!data.username){
    		return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.INCOMPLETE_DATA.message});
    	}
    	authenticationService
    	.checkUsernameExistence(data.username)
		.then(function(rows) {
			if(rows.length > 0) {
				res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.USERNAME_IN_USE.message});
			} else {
				res.status(genericConstants.OK).json({success : true});
			}
		})
    	.catch(function(error) {
    		res.status(genericConstants.UNAUTHORIZED).json({error : error});
    	});
    	
    });

    application.post(genericConstants.EMAIL_CHECK_URL, function(req, res) {
    	var data = req.body;
    	if(!data.email){
    		return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.INCOMPLETE_DATA.message});
    	}

    	authenticationService
    	.checkEmailExistence(data.email)
    	.then(function(rows) {
			if(rows.length > 0) {
		   		res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.EMAIL_IN_USE.message});
			} else {
    			res.status(genericConstants.OK).json({success : true});
			}
		})
    	.catch(function(error) {
	    	res.status(genericConstants.UNAUTHORIZED).json({error : error});
    	});
    });

	application.get(genericConstants.LOGIN_URL, function(req, res) {
		var header = req.headers.authorization;
		if(!header) {
			return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.BAD_CREDENTIALS.message});
		}
		authenticationService
		.loginUser(header, res)
		.catch(function(error){
			res.status(genericConstants.UNAUTHORIZED).json({error : error});
		});
	});

	application.post(genericConstants.ACTIVATE_ACCOUNT_URL, function(req,res) {
		var data = req.body;
		if(!data.hash){
    		return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.INCOMPLETE_DATA.message});
    	}

    	authenticationService
		.activateAccount(data.hash, res)
		.catch(function(error){
			res.status(genericConstants.UNAUTHORIZED).json({error : error});
		});
	});

	application.post(genericConstants.REGISTRATION_URL, function(req, res) {
		var header = req.headers['authorization'];

		if(!header){
			return res.status(genericConstants.UNAUTHORIZED).json({
				error : authenticationConstants.BAD_CREDENTIALS.message
			});
		}
		
		authenticationService
		.registerUser(header, res)
		.catch(function(error){
			console.log(error.message);
			res.status(genericConstants.INTERNAL_ERROR).json({error : error});
		});
	});

	application.post(genericConstants.SET_PROFILE_URL, function(req, res) {
		var data = req.body;
		if(!data.hash
		|| !data.username
		|| !data.birthdate
		|| !data.gender) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INCOMPLETE_DATA.message
			});
		}

		authenticationService
		.setUserProfile(data, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({error : error});
		});
	});

	application.post(genericConstants.RESEND_EMAIL_URL, function(req, res) {
		var data = req.body;
		if(!data.email){
    		return res.status(genericConstants.UNAUTHORIZED).json({error : authenticationConstants.INCOMPLETE_DATA.message});
    	}

    	authenticationService
		.resendEmail(data.email, res)
		.catch(function(error){
			res.status(genericConstants.UNAUTHORIZED).json({error : error});
		});
	});

	application.get(genericConstants.LOGOUT_URL, function(req, res) {
		res.status(authConst.OK).json({});
	});
    
};