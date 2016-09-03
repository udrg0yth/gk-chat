module.exports = function(application, genericConstants, tokenHandler, authMysqlHandler, personalityMysqlHandler, iqMysqlHandler, gkMysqlHandler, genericTools, personalityTools) {
	var authenticationConstants 	  	=  require('./authentication-constants')(),
		corsFilter    					=  require('./cors-filter')(application),
		authenticationService  		  	=  require('./authentication-service')(application, 
			authenticationConstants, genericConstants, tokenHandler, authMysqlHandler, personalityMysqlHandler, iqMysqlHandler, gkMysqlHandler, genericTools, personalityTools);
  
  	application.get(genericConstants.STATISTICS_URL, function(req, res) {
  		authenticationService.getStatistics(res);
  	});

  	application.post(genericConstants.VERIFY_TOKEN_URL, function(req, res) {
		var data = req.body;
		if(!authenticationService.verifyToken(data.token)) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				message : authenticationConstants.BAD_CREDENTIALS.message
			});
		}
		res.status(genericConstants.OK).json({});
  	});

    application.post(genericConstants.USERNAME_CHECK_URL, function(req, res) {
    	var data = req.body;
    	if(!data.username){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	 authenticationService
    	.checkUsernameExistence(data.username)
		.then(function(rows) {
			if(rows.length > 0) {
				res.status(genericConstants.UNAUTHORIZED).json({
					message : authenticationConstants.USERNAME_IN_USE.message
				});
			} else {
				res.status(genericConstants.OK).json({});
			}
		})
    	.catch(function(error) {
    		res.status(genericConstants.UNAUTHORIZED).json({
    			message : error.message,
    			trace: 'A-SRV-UC'
    		});
    	});
    	
    });

    application.post(genericConstants.EMAIL_CHECK_URL, function(req, res) {
    	var data = req.body;
    	if(!data.email){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	 authenticationService
    	.checkEmailExistence(data.email)
    	.then(function(rows) {
			if(rows.length > 0) {
		   		res.status(genericConstants.UNAUTHORIZED).json({
		   			message : authenticationConstants.EMAIL_IN_USE.message
		   		});
			} else {
    			res.status(genericConstants.OK).json({});
			}
		})
    	.catch(function(error) {
	    	res.status(genericConstants.INTERNAL_ERROR).json({
	    		message : error.message,
    			trace: 'A-SRV-EC'
	    	});
    	});
    });

	application.get(genericConstants.LOGIN_URL, function(req, res) {
		var header = req.headers.authorization;
		if(!header) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				message : authenticationConstants.BAD_CREDENTIALS.message
			});
		}

		 authenticationService
		.loginUser(header, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-L'
			});
		});
	});

	application.post(genericConstants.ACTIVATE_ACCOUNT_URL, function(req,res) {
		var data = req.body;
		if(!data.hash){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	authenticationService
		.activateAccount(data.hash, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-AA'
			});
		});
	});

	application.post(genericConstants.GET_PROFILE_QUESTIONS_URL, function(req,res) {
		var data = req.body;
		if(!data.hash){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	authenticationService
		.getProfileQuestions(data.hash, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-GPRFQ'
			});
		});
	});

	application.post(genericConstants.GET_HASH_URL, function(req, res) {
		var data = req.body;
		if(!data.email){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	 authenticationService
    	.getHash(data.email, res)
    	.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-GHSH'
			});
		});
	});

	application.post(genericConstants.CHECK_HASH_URL, function(req, res) {
		var data = req.body;
		if(!data.hash){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	 authenticationService
    	.checkHash(data.hash, res)
    	.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-CHSH'
			});
		});
	});

	application.post(genericConstants.REGISTRATION_URL, function(req, res) {
		var data = req.body,
			header = req.headers['authorization'];

		if(!header){
			return res.status(genericConstants.UNAUTHORIZED).json({
				message : authenticationConstants.BAD_CREDENTIALS.message
			});
		}
		
		authenticationService
		.registerUser(header, data.sendEmail, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-R'
			});
		});
	});

	application.post(genericConstants.SET_PROFILE_URL, function(req, res) {
		var data = req.body;
		console.log(data);
		if(!data.hash ||
		!data.basicInfo ||
		!data.personalityAnswer ||
		!data.iqAnswer ||
		!data.gkAnswer) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				message: genericConstants.INCOMPLETE_DATA.message
			});
		}

		if(data.basicInfo.gender == null||
		   data.basicInfo.birthdate == null ||
		   data.basicInfo.username == null||
		   data.personalityAnswer.negativelyAffectedType  == null ||
		   data.personalityAnswer.answer == null ||
		   data.gkAnswer.questionId == null||
           data.gkAnswer.answer == null ||
           data.iqAnswer.questionId  == null ||
           data.iqAnswer.answer == null) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				message: genericConstants.INCOMPLETE_DATA.message
			});
		}

		authenticationService
		.setUserProfile(data, res)
		.catch(function(error){
			res.status(genericConstants.INTERNAL_ERROR).json({
				message : error.message,
    			trace: 'A-SRV-SP'
			});
		});
	});

	application.post(genericConstants.RESEND_EMAIL_URL, function(req, res) {
		var data = req.body;
		if(!data.email){
    		return res.status(genericConstants.UNAUTHORIZED).json({
    			message : authenticationConstants.INCOMPLETE_DATA.message
    		});
    	}

    	authenticationService
		.resendEmail(data.email, res)
		.catch(function(error){
			res.status(genericConstants.UNAUTHORIZED).json({
				message : error.message,
    			trace: 'A-SRV-RE'
			});
		});
	});

	application.get(genericConstants.LOGOUT_URL, function(req, res) {
		res.status(genericConstants.OK).json({});
	});
    
};