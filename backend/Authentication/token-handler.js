module.exports = function(app,
						  authConst) {
	var uuid        =  require('node-uuid');
	var jwt 		=  require('jsonwebtoken');
	var secretKey   =  uuid.v4(); 

	function tokenInterceptor(req, res, next) {
		if(req.url === authConst.loginUrl
		|| req.url === authConst.registrationUrl) {
			return next();
		}
		return next();
		
		var data = req.body;
		if(!data.token){
			res.status(authConst.UNAUTHORIZED).json(authConst.authFailed);
		}
		try {
			jwt.verify(data.token, secretKey);
			next();
		} catch(ex) {
			res.status(authConst.UNAUTHORIZED).json(authConst.authFailed);
		}
	}

	app.use(tokenInterceptor);

	return {
		'generateToken': function(claims) {
			return jwt.sign(claims, secretKey);
		}
	};
};