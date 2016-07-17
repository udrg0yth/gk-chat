module.exports = function(genericConstants, connection) {
	return  {
		getNextQuestion: function(userId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$columns', genericConstants.PERSONALITY_QUESTION_COLUMNS_WITH_ID)
							.replace('$table', genericConstants.USER_TABLE + ' JOIN ' + genericConstants.PERSONALITY_QUESTIONS_TABLE +
								 ' ON (current_personality_question_id=personality_question_id)')
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		},
		updateNextQuestionAndPersonality: function(userId, currentPersonalityRaw, currentPersonality) {
			console.log(currentPersonality);
			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', 'current_personality_question_id=current_personality_question_id+1,' +
								'current_personality_raw="' + currentPersonalityRaw + '", current_personality="' +
								currentPersonality + '"')
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		},
		getCurrentPersonalityRaw: function(userId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', 'current_personality_raw')
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		}
	};
};