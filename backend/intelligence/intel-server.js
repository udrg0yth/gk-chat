module.exports = function(application, genericConstants, tokenHandler, iqMysqlHandler, genericTools) {
	var iqConstants		 	  	=  require('./intel-constants')(),
		iqService               =  require('./intel-service')(application, iqConstants, genericConstants, iqMysqlHandler, tokenHandler);


    application.get(genericConstants.RANDOM_IQ_QUESTION_FOR_PROFILE_URL, function(req, res) {
         iqService
        .getRandomQuestionForProfile(res)
        .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'IQ-SRV-GRQFP'
            });
        });
    });

    application.post(genericConstants.ANSWER_IQ_QUESTION_FOR_PROFILE_URL, function(req, res) {
        var quiz = req.body;

         if(!data.hash
         || !quiz.questionId
         || !quiz.answer) {
            res.status(genericConstants.UNAUTHORIZED).json({
                message: genericConstants.INCOMPLETE_DATA.message
            });
        }

         iqService
        .answerQuestionForProfile(genericTools.decrypt(data.hash), quiz, res)
        .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'IQ-SRV-GRQFP'
            });
        });
    });

	application.post(genericConstants.RANDOM_IQ_QUESTION_URL, function(req, res) {
		 var data = req.body,
             token = req.headers['x-auth-token'],
         	 user = token?tokenHandler.decodeToken(token):null;

          if(!user
          || !data.reqtimestamp) {
            return res.status(genericConstants.UNAUTHORIZED).json({
                error: genericConstants.INCOMPLETE_DATA.message
            });
          }

          if(!user.isMember) {
            if(!user.iqQuestionsRemaining) {
                return res.status(genericConstants.UNAUTHORIZED).json({
                    error: genericConstants.NO_MORE_IQ_QUESTIONS.message
                });
            }
          }

          var requestTime = (Date.now() - data.reqtimestamp)/1000;

          iqService
         .getRandomQuestion(user, requestTime, res)
         .catch(function(error) {
         	res.status(genericConstants.INTERNAL_ERROR).json({
         		message: error.message,
         		trace: 'IQ-SRV-GRQ'
         	});
         });
	});

	application.post(genericConstants.ANSWER_IQ_QUESTION_URL, function(req, res) {
		 var quiz = req.body,
		 	 token = req.headers['x-auth-token'],
         	 user = token?tokenHandler.decodeToken(token):null;

         if(!quiz.questionId
         || !quiz.answer
         || !quiz.reqtimestamp) {
         	res.status(genericConstants.UNAUTHORIZED).json({
         		message: genericConstants.INCOMPLETE_DATA.message
         	});
         }

         var requestTime = (Date.now() - data.reqtimestamp)/1000;

          iqService
         .answerQuestion(user, requestTime, question, res)
         .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'IQ-SRV-AQ'
            });
         });
    });
};