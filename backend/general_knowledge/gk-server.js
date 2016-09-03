module.exports = function(application, genericConstants, tokenHandler, gkMysqlHandler, genericTools) {
	var gkConstants		 	  	=  require('./gk-constants')(),
		gkService               =  require('./gk-service')(application, gkConstants, genericConstants, gkMysqlHandler);


	application.post(genericConstants.RANDOM_GK_QUESTION_URL, function(req, res) {
		 var data = req.body,
             token = req.headers['x-auth-token'],
             user = token?tokenHandler.decodeToken(token):null;

          if(!user ||
          !data.reqtimestamp) {
            return res.status(genericConstants.UNAUTHORIZED).json({
                error: genericConstants.INCOMPLETE_DATA.message
            });
          }

          if(!user.isMember) {
            if(!user.gkQuestionsRemaining) {
                return res.status(genericConstants.UNAUTHORIZED).json({
                    error: genericConstants.NO_MORE_GK_QUESTIONS.message
                });
            }
          }

          var requestTime = (Date.now() - data.reqtimestamp)/1000;

          gkService
         .getRandomQuestion(user, requestTime, res)
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
             user = token?tokenHandler.decodeToken(token):null;

         if(!quiz.questionId ||
         !quiz.answer ||
         !quiz.reqtimestamp) {
            res.status(genericConstants.UNAUTHORIZED).json({
                message: genericConstants.INCOMPLETE_DATA.message
            });
         }

         var requestTime = (Date.now() - data.reqtimestamp)/1000;

          gkService
         .answerQuestion(user, requestTime, question, res)
         .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'GK-SRV-AQ'
            });
         });
	});
};