module.exports = function(application, genericConstants, tokenHandler, iqMysqlHandler, genericTools) {
	var iqConstants		 	  	=  require('./intel-constants')(),
		iqService               =  require('./intel-service')(application, iqConstants, genericConstants, iqMysqlHandler);


	application.post(genericConstants.RANDOM_IQ_QUESTION_URL, function(req, res) {
		 var data = req.body,
             token = req.headers['x-auth-token'],
         	 user = token?tokenHandler.decodeToken(token):(data.hash?{
                id: genericTools.decrypt(data.hash)
            }:null);

          if(!user
          || !data.reqtimestamp) {
            return res.status(genericConstants.UNAUTHORIZED).json({
                error: genericConstants.INCOMPLETE_DATA.message
            });
          }

          var requestTime = (Date.now() - data.reqtimestamp)/1000;

          iqService
         .getRandomQuestion(user.id, requestTime, res)
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
         		message: genericConstants.INCOMPLETE_DATA.message
         	});
         }
          iqService
         .answerQuestion(user.id, question)
         .catch(function(error) {
            res.status(genericConstants.INTERNAL_ERROR).json({
                message: error.message,
                trace: 'IQ-SRV-AQ'
            });
         });
    });
};