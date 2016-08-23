module.exports = function(genericConstants, connection) {

	
	return {
		gatherPersonalityStatistics: function() {
			return connection.query(genericConstants.PERONALITY_STATISTICS_QUERY);
		},
		gatherGeneralKnowledgeStatistics: function() {
		 	return connection.query(genericConstants.GENERAL_KNOWLEDGE_STATISTICS_QUERY);
		},
		gatherIQStatistics: function() {
		  return connection.query(genericConstants.IQ_STATISTICS_QUERY);
		},
		setUserProfile: function(userId, profile) {
		  return connection.query(genericConstants
						.SET_USER_PROFILE_QUERY
						.replace('$username', profile.username)
						.replace('$birthdate', profile.birthdate)
						.replace('$gender', profile.gender)
						.replace('$userId', userId));
		},
		getIdFromEmail: function(email) {
			return connection.query(genericConstants
						.GET_ID_FROM_EMAIL_QUERY
						.replace('$email', email));
		},
		getEmailFromId: function(userId) {
			return connection.query(genericConstants
								.GET_EMAIL_FROM_ID_QUERY
								.replace('$userId', userId));
		},
		checkProfileCompletionById: function(userId) {
			return connection.query(genericConstants
								.CHECK_PROFILE_COMPLETION_QUERY
								.replace('$userId', userId));
		},
		registerUser: function(user) {
			return connection.query(genericConstants
							.REGISTER_USER_QUERY
							.replace('$email', user.email)
							.replace('$password', user.password)
							.replace('$remainingIqQuestions', genericConsntants.IQ_MAX_QUESTIONS_FOR_NON_MEMBERS)
							.replace('$remainingGkQuestions', genericConsntants.GK_MAX_QUESTIONS_FOR_NON_MEMBERS)
							.replace('$remainingMatchTrials', genericConsntants.MATCH_MAX_TRIALS_FOR_NON_MEMBERS));
		},
		activateAccount: function(userId) {
			return connection.query(genericConstants
								.ACTIVATE_ACCOUNT_QUERY
								.replace('$userId', userId));
		},
		checkEmailExistence: function(email) {
			var queryString = 'SELECT email FROM user WHERE email="' + email + '"';
			return connection.query(genericConstants
								.CHECK_EMAIL_EXISTECE_QUERY
								.replace('$email', email));
		},
		checkUsernameExistence: function(username) {
			return connection.query(genericConstants
								.CHECK_USERNAME_EXISTENCE_QUERY
								.replace('$username', username));
		},
		getAccountStatus: function(userId) {
			return connection.query(genericConstants
								.GET_ACCOUNT_STATUS_QUERY
								.replace('$userId', userId));
		},
		getUserDataByEmail: function(email) {
			return connection.query(genericConstants
								.GET_USER_DATA_BY_EMAIL_QUERY
								.replace('$email', email));
		}
	};
};