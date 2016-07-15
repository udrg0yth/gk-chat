module.exports = function(application, genericConstants, tokenHandler, persMysqlHandler) {
	var personalityConstants		 	  	=  require('./personality-constants')(),
		  personalityService  		  	  =  require('./personality-service')(application, personalityConstants, genericConstants, persMysqlHandler);

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

  application.get(genericConstants.CURRENT_PERSONALITY_URL, function(req, res){
      var token = req.headers['x-auth-token'],
          user = tokenHandler.decodeToken(token);

      personalityService
      .getPersonality(user.userId, res)
      .catch(function(error) {
        res.status(genericConstants.UNAUTHORIZED).json({
          error: error.message
        });
      });
  });

  application.post(genericConstants.ANSWER_PERSONALITY_QUESTION_URL, function(req, res) {
      var question = req.body;
      if(!question.answer
      || !question.negativelyAffectedType) {
        return res.status(genericConstants.UNAUTHORIZED).json({
            error: genericConstants.INCOMPLETE_DATA.message
        });
      }

      personalityService.
      answerQuestion(question, res)
      .catch(function(error) {
        res.status(genericConstants.UNAUTHORIZED).json({
          error: error.message
        });
      });
  });
};