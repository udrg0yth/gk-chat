module.exports = function(application, personalityConstants, genericConstants, persMysqlHandler) {
		return {
			getNextQuestion: function(userId, res) {
				return persMysqlHandler
					.getNextQuestion(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							res.status(genericConstants.OK).json({
								questionId: rows[0].personality_question_id,
								question: rows[0].personality_question
							});
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								error: personalityConstants.NO_MORE_QUESTIONS.message 
							});
						}
					});
			} 
		};
};