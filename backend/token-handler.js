module.exports = function(application,
						  genericConstants) {
	var uuid        =  require('node-uuid');
	var jwt 		=  require('jsonwebtoken');
	var secretKey   =  uuid.v4(); 

	function tokenInterceptor(req, res, next) {
		if(req.url === genericConstants.LOGIN_URL ||
		req.url === genericConstants.REGISTRATION_URL ||
		req.url === genericConstants.ACTIVATE_ACCOUNT_URL ||
		req.url === genericConstants.USERNAME_CHECK_URL ||
		req.url === genericConstants.EMAIL_CHECK_URL ||
		req.url === genericConstants.GET_HASH_URL ||
		req.url === genericConstants.CHECK_HASH_URL ||
		req.url === genericConstants.SET_PROFILE_URL ||
		req.url === genericConstants.GET_PROFILE_QUESTIONS_URL) {
			return next();
		}
		var token = req.headers['x-auth-token'];

		if(!token){
			return res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});	
		}

		try {
			jwt.verify(token, secretKey);
		} catch(ex) {
			return res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});
		}

		if(req.url === genericConstants.RANDOM_GK_QUESTION_URL) {
			var decodedToken = jwt.decode(token);
			if(!decodedToken.gkr) {
				return res.status(genericConstants.UNAUTHORIZED).json({
					error: genericConstants.NO_MORE_GK_QUESTIONS.message
				});
			}
		}

		if(req.url === genericConstants.RANDOM_IQ_QUESTION_URL) {
			var decodedToken = jwt.decode(token);
			if(!decodedToken.gkr) {
				return res.status(genericConstants.UNAUTHORIZED).json({
					error: genericConstants.NO_MORE_IQ_QUESTIONS.message
				});
			}
		}
	}

	application.use(tokenInterceptor);

	return {
		generateToken: function(user) {
			return jwt.sign({
							ky: user.id,
							usr: user.username,
							bd: user.age,
							g: user.gender,
							iq: user.iqScore,
							gk: user.gkScore,
							p: user.personality,
							m: user.isMember,
							iqr: user.iqQuestionsRemaining,
							gkr: user.gkQuestionsRemaining,
							mtr: user.matchTrialsRemaining
						}, secretKey);
		},
		verifyToken: function(token) {
			if(!token) {
				return false;
			}
			try {
				jwt.verify(data.token, secretKey);
			} catch(ex) {
				return false;
			}
			return true;
		},
		decodeToken: function(token) {
			return jwt.decode(token);
		}
	};
};