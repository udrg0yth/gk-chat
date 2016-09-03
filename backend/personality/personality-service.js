module.exports = function(application, personalityConstants, genericConstants, persMysqlHandler) {
		var personalityTools = require('./personality-tools')();

		var getPersonalityExchangeModel = function(rows) {
			return {
				questionId: rows[0].personality_question_id,
				negativelyAffectedType: rows[0].negatively_affected_type,
				question: rows[0].personality_question
			};
		};

		return {
			getNextQuestion: function(userId, res) {
				return persMysqlHandler
					.getNextQuestion(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							console.log(rows);
							res.status(genericConstants.OK).json(getPersonalityExchangeModel(rows));
						} else {
							res.status(genericConstants.UNAUTHORIZED).json({
								message: personalityConstants.NO_MORE_QUESTIONS.message 
							});
						}
					});
			},
			answerQuestion: function(userId, question, res) {
				return persMysqlHandler
					.getCurrentPersonalityRaw(userId)
					.then(function(rows) {
						if(rows.length > 0) {
							var updatedPersonality = personalityTools.updatePersonality(rows[0].current_personality_raw, 
								parseInt(question.negativelyAffectedType), question.answer),
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