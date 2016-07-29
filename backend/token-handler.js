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
		return next();
		
		var data = req.body;
		if(!data.token){
			res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});	
		}
		try {
			jwt.verify(data.token, secretKey);
			next();
		} catch(ex) {
			res.status(genericConstants.UNAUTHORIZED).json({
				error: genericConstants.INVALID_TOKEN.message
			});
		}
	}

	application.use(tokenInterceptor);

	return {
		generateToken: function(user) {
			return jwt.sign({
							id: user.user_id,
							username: user.username,
							birthdate: user.birthdate,
							gender: user.gender,
							iqScore: user.current_iq_score,
							gkScore: user.current_gk_score,
							personality: user.current_personality,
							credits: user.credits
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