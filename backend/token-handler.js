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
		generateToken: function(claims) {
			return jwt.sign(claims, secretKey);
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