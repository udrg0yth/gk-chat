module.exports = function(genericConstants, connection) {
	return  {
		countQuestions: function() {
		  	return connection.query(genericConstants.COUNT_IQ_QUESTIONS_QUERY);
		},
		updateRemainingIqQuestions: function() {
		  	return connection.query(genericConstants.UPDATE_REMAINING_IQ_QUESTIONS_QUERY);
		},
		getRemainingIqQuestionsForUser: function(userId) {
			return connection.query(genericConstants
							.GET_REMAINING_IQ_QUESTIONS_FOR_USER
							.replace('$userId', userId));
		},
		getQuestionForUser: function(userId) {
			return connection.query(genericConstants
								.GET_IQ_QUESTION_FOR_USER_QUERY
								.replace('$userId', userId));
		},
		getQuestionById: function(questionId) {
			return connection.query(genericConstants
								.GET_IQ_QUESTION_BY_ID_QUERY
								.replace('$questionId', questionId));
		},
		setTimeout: function(userId, questionId) {
			return connection.query(genericConstants
								.SET_IQ_TIMEOUT_QUERY
								.replace('$userId', userId)
								.replace('$questionId', questionId));
		},
		removeTimeout: function(userId) {
			return connection.query(genericConstants
								.REMOVE_IQ_TIMEOUT_QUERY
								.replace('$userId', userId));
		},
		updateUserScoreEasy: function(userId, isCorrect) {
			return connection.query(genericConstants
				.UPDATE_USER_IQ_EASY_SCORE_QUERY
				.replace('$userId', userId)
				.replace('$isCorrect', isCorrect)
				.replace('$isCorrect', isCorrect));
		},
		updateUserScoreMedium: function(userId, isCorrect) {
			return connection.query(genericConstants
				.UPDATE_USER_IQ_MEDIUM_SCORE_QUERY
				.replace('$userId', userId)
				.replace('$isCorrect', iscorrect)
				.replace('$isCorrect', isCorrect));
		},
		updateUserScoreHard: function(userId, isCorrect) {
			return connection.query(genericConstants
				.UPDATE_USER_IQ_HARD_SCORE_QUERY
				.replace('$userId', userId)
				.replace('$isCorrect', iscorrect)
				.replace('$isCorrect', isCorrect));
		},
		updateUserScoreGlobalEasy: function() {
			return connection.query(genericConstants.UPDATE_USER_IQ_EASY_SCORE_GLOBAL_QUERY);
		},
		updateUserScoreGlobalMedium: function() {
			return connection.query(genericConstants.UPDATE_USER_IQ_MEDIUM_SCORE_GLOBAL_QUERY);
		},
		updateUserScoreGlobalHard: function() {
			return connection.query(genericConstants.UPDATE_USER_IQ_HARD_SCORE_GLOBAL_QUERY);
		},
		removeTimedOutQuestionsEasy: function() {
			return connection.query(genericConstants.REMOVE_TIMED_OUT_IQ_EASY_QUESTIONS_GLOBAL_QUERY);
		},
		removeTimedOutQuestionsMedium: function() {
			return connection.query(genericConstants.REMOVE_TIMED_OUT_IQ_MEDIUM_QUESTIONS_GLOBAL_QUERY);
		},
		removeTimedOutQuestionsHard: function() {
			return connection.query(genericConstants.REMOVE_TIMED_OUT_IQ_HARD_QUESTIONS_GLOBAL_QUERY);
		}
	};
};