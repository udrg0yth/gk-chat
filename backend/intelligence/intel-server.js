module.exports = function(application, genericConstants, tokenHandler, iqMysqlHandler) {
	var iqConstants		 	  	=  require('./iq-constants')(),
		iqService               =  require('./iq-service')(application, iqConstants, genericConstants, iqMysqlHandler);

	application.get(genericConstants.RANDOM_IQ_QUESTION_URL, function(req, res) {
		 var token = req.headers['x-auth-token'],
         	 user = tokenHandler.decodeToken(token);

          iqService
         .getRandomQuestion(user.id, res)
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
         	 user = tokenHandler.decodeToken(token);

         if(!quiz.questionId
         || !quiz.answer) {
         	res.status(genericConstants.UNAUTHORIZED).json({
         		message: genericConstants: INCOMPLETE_DATA.message
         	});
         }
          gkService
         .answerQuestion(user.id, question)
         .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'IQ-SRV-AQ'
            });
         });
};