module.exports = function(application, genericConstants, tokenHandler, gkMysqlHandler) {
	var gkConstants		 	  	=  require('./gk-constants')(),
		gkService               =  require('./gk-service')(application, gkConstants, genericConstants, gkMysqlHandler);

	application.post(genericConstants.RANDOM_GK_QUESTION_URL, function(req, res) {
		 var data = req.body,
             token = req.headers['x-auth-token'],
         	 user = tokenHandler.decodeToken(token);
          console.log(token);

          gkService
         .getRandomQuestion(user.id, data.requestTime, data.responseTime, res)
         .catch(function(error) {
         	res.status(genericConstants.INTERNAL_ERROR).json({
         		message: error.message,
         		trace: 'GK-SRV-GRQ'
         	});
         });
	});

	application.post(genericConstants.ANSWER_GK_QUESTION_URL, function(req, res) {
		 var quiz = req.body,
		 	 token = req.headers['x-auth-token'],
         	 user = tokenHandler.decodeToken(token);

         if(!quiz.questionId
         || !quiz.answer
         || !quiz.requestTime
         || !quiz.responseTime) {
         	res.status(genericConstants.UNAUTHORIZED).json({
         		message: genericConstants.INCOMPLETE_DATA.message
         	});
         }
         
          gkService
         .answerQuestion(user.id, quiz)
         .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'GK-SRV-AQ'
            });
         });
	});
};