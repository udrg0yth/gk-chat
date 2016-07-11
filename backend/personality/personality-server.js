module.exports = function(application, genericConstants, tokenHandler, persMysqlHandler) {
	var personalityConsants		 	  	=  require('./personality-constants')(),
		personalityService  		  	=  require('./personality-service')(application, personalityConstants, genericConstants, persMysqlHandler);

	application.get(genericConstants.NEXT_PERSONALITY_QUESTION_URL, function(req, res) {
  		var data = req.body,
  			  token = req.headers['x-auth-token'],
			    user = tokenHandler.decodeToken(token);

  		 personalityService
  		.getNextQuestion(user.userId, res)
  		.catch(function(error) {
  			res.status(genericConstants.UNAUTHORIZED).json({
  				error: error.message
  			});
  		});
      
  });
};