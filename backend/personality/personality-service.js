module.exports = function(application, personalityConstants, genericConstants, persMysqlHandler) {
		var personalityTools = require('./personality-tools')();

		return {
			getNextQuestion: function(userId, res) {
				return persMysqlHandler
					.getNextQuestion(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							console.log(rows);
							res.status(genericConstants.OK).json({
								questionId: rows[0].personality_question_id,
								negativelyAffectedType: rows[0].negatively_affected_type,
								question: rows[0].personality_question
							});
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								message: personalityConstants.NO_MORE_QUESTIONS.message 
							});
						}
					});
			},
			getPersonality: function(userId, res) {
				return persMysqlHandler
					.getCurrentPersonalityRaw(userId)
					.then(function(rows) {
						res.status(genericConstants.OK).json(
							personalityTools.formatPersonality(rows[0].current_personality_raw)
						);
					});
			},
			answerQuestion: function(userId, question, res) {
				return persMysqlHandler
					.getCurrentPersonalityRaw(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							var updatedPersonality = personalityTools.updatePersonality(rows[0].current_personality_raw, 
								question.negativelyAffectedType, question.answer),
								formattedPersonality = personalityTools.formatPersonality(updatedPersonality);
							persMysqlHandler
							.updateNextQuestionAndPersonality(userId, updatedPersonality,
									personalityTools.reducePersonality(formattedPersonality))
							.then(function(data) {
								res.status(genericConstants.OK).json(formattedPersonality);
							})
							.catch(function(error) {
								res.status(genericConstants.INTERNAL_ERROR).json({
					  				message: error.message,
					  				trace: 'P-SCE-AQ'
					  			});
							});
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								message: personalityConstants.UNKNOWN_USER.message 
							});
						}
					});
			}
		};
};