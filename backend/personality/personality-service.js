module.exports = function(application, personalityConstants, genericConstants, persMysqlHandler) {
		var personalityTools = require('./personality-tools')();

		return {
			getNextQuestion: function(userId, res) {
				return persMysqlHandler
					.getNextQuestion(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							res.status(genericConstants.OK).json({
								questionId: rows[0].personality_question_id,
								negativelyAffectedType: rows[0].netively_affected_type,
								question: rows[0].personality_question
							});
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								error: personalityConstants.NO_MORE_QUESTIONS.message 
							});
						}
					});
			},
			updateNextQuestionAndPersonality: function(question, res) {
				return persMysqlHandler
					.getCurrentPersonality(question.userId)
					.then(function(rows) {
						if(rows.length > 0) {
							var updatedPersonality = personalityTools.updatePersonality(rows[0].current_personality, 
								question.negativelyAffectedType, question.answer);
							persMysqlHandler
							.updateNextQuestionAndPersonality(question.userId, updatedPersonality)
							.then(function(data) {
								res.status(genericConstants.OK).json({});
							})
							.catch(function(error) {
								res.status(genericConstants.UNAUTHORIZED).json({
					  				error: error.message
					  			});
							});
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								error: personalityConstants.UNKNOWN_USER.message 
							});
						}
					});
			}
		};
};