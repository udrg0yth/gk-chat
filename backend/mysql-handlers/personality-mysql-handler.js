module.exports = function(genericConstants, connection) {
	return  {
		getNextQuestion: function(userId) {
			return connection.query(genericConstants
								.GET_NEXT_PERSONALITY_QUESTION_QUERY
								.replace('$userId', userId));
		},
		updateNextQuestionAndPersonality: function(userId, currentPersonalityRaw, currentPersonality) {
			return connection.query(genericConstants
								.UPDATE_NEXT_QUESTION_AND_PERSONALITY_QUERY
								.replace('$currentPersonalityRaw', currentPersonalityRaw)
								.replace('$currentPersonality', currentPersonality)
								.replace('$userId', userId));
		},
		getCurrentPersonalityRaw: function(userId) {
			return connection.query(genericConstants
								.GET_CURRENT_PERSONALITY_ROW_QUERY
								.replace('$userId', userId));
		}
	};
};