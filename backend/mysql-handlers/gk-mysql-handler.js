module.exports = function(genericConstants, connection) {
	return  {
		countQuestions: function() {
		   return connection.query(genericConstants.COUNT_GK_QUESTIONS_QUERY);
		}, 
		updateRemainingGKQuestions: function() {
		  	return connection.query(genericConstants.UPDATE_REMAINING_GK_QUESTIONS_QUERY);
		},
		getQuestionForUser: function(userId) {
			return connection.query(genericConstants
							.GET_GK_QUESTION_FOR_USER_QUERY
							.replace('$userId', userId));
		},
		getQuestionById: function(questionId) {
			return connection.query(genericConstants
							.GET_GK_QUESTION_BY_ID_QUERY
							.replace('$questionId', questionId));
		},
		setTimeout: function(userId, questionId) {
			return connection.query(genericConstants
							.SET_GK_TIMEOUT_QUERY
							.replace('$userId', userId)
							.replace('$questionId', questionId));
		},
		updateUserScore: function(userId, isCorrect) {
			return connection.query(genericConstants
							.UPDATE_USER_GK_SCORE_QUERY
							.replace('$userId', userId)
							.replace('$isCorrect', isCorrect));
		},
		updateUserScoreGlobal: function() {
			return connection.query(genericConstants.UPDATE_USER_GK_SCORE_GLOBAL_QUERY);
		},
		removeTimeout: function(userId) {
			return connection.query(genericConstants
								.REMOVE_GK_TIMEOUT_QUERY
								.replace('$userId', userId));
		},
		removeTimedOutQuestions: function() {
			return connection.query(genericConstants.REMOVE_TIMED_OUT_GK_QUESTIONS_GLOBAL_QUERY);
		},
		saveQuestion: function(question) {
			/*var values = '"' + question.question + '",' +
						 '"' + question.answer1 + '",' +
						 '"' + question.answer2 + '",' +
						 '"' + question.answer3 + '",' +
						 '"' + question.answer4 + '",' +
						 '"' + question.category + '"',
				queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);	*/		 
		}
	};
};