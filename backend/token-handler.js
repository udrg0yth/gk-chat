module.exports = function(application,
						  genericConstants) {
	var uuid        =  require('node-uuid');
	var jwt 		=  require('jsonwebtoken');
	var secretKey   =  uuid.v4(); 

	function tokenInterceptor(req, res, next) {
		if(req.url === genericConstants.LOGIN_URL
		|| req.url === genericConstants.REGISTRATION_URL) {
			return next();
		}

		
		var data = req.body;
		if(!data.token){
			res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});	
		}
		try {
			jwt.verify(data.token, secretKey);
		} catch(ex) {
			res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});
		}

		if(req.url === genericConstants.RANDOM_GK_QUESTION_URL) {
			var token = jwt.decode(token);
			if(!token.gkr) {
				res.status(genericConstants.UNAUTHORIZED).json({
					error: genericConstants.NO_MORE_GK_QUESTIONS.message
				});
			}
		}

		if(req.url === genericConstants.RANDOM_IQ_QUESTION_URL) {
			var token = jwt.decode(token);
			if(!token.gkr) {
				res.status(genericConstants.UNAUTHORIZED).json({
					error: genericConstants.NO_MORE_IQ_QUESTIONS.message
				});
			}
		}
	}

	application.use(tokenInterceptor);

	return {
		generateToken: function(user) {
			return jwt.sign({
							ky: user.user_id,
							usr: user.username,
							bd: user.birthdate,
							g: user.gender,
							iq: user.current_iq_score,
							gk: user.current_gk_score,
							p: user.current_personality,
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