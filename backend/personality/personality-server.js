module.exports = function(application, genericConstants, tokenHandler, persMysqlHandler, genericTools) {
	var personalityConstants		 	  	=  require('./personality-constants')(),
		  personalityService  		  	  =  require('./personality-service')(application, personalityConstants, genericConstants, persMysqlHandler);


	application.post(genericConstants.NEXT_PERSONALITY_QUESTION_URL, function(req, res) {
  		var data = req.body,
  			  token = req.headers['x-auth-token'],
			    user = token? tokenHandler.decodeToken(token):null;

      if(!user) {
        return res.status(genericConstants.UNAUTHORIZED).json({
            error: genericConstants.INCOMPLETE_DATA.message
        });
      }

  		 personalityService
  		.getNextQuestion(user.id, res)
  		.catch(function(error) {
  			res.status(genericConstants.INTERNAL_ERROR).json({
  				message: error.message,
          trace: 'P-SRV-NQ'
  			});
  		});
  });

  application.post(genericConstants.ANSWER_PERSONALITY_QUESTION_URL, function(req, res) {
      var question = req.body;
      var token = req.headers['x-auth-token'],
          user = token? tokenHandler.decodeToken(token): null;

      if(!question.answer ||
      !question.negativelyAffectedType ||
      !user) {
        return res.status(genericConstants.UNAUTHORIZED).json({
            error: genericConstants.INCOMPLETE_DATA.message
        });
      }

      personalityService.
      answerQuestion(user.id, question, res)
      .catch(function(error) {
        res.status(genericConstants.INTERNAL_ERROR).json({
          message: error.message,
          trace: 'P-SRV-AQ'
        });
      });
  });
};