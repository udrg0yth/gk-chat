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
			var queryString = 'UPDATE user SET username="' + profile.username + '",birthdate="'
				+ profile.birthdate + '",gender="' + profile.gender + '",last_login_date=NOW() '
				+ 'WHERE user_id="' + userId + '"';
			return connection.query(queryString);
		},
		getIdFromEmail: function(email) {
			var queryString = 'SELECT user_id FROM user WHERE email="' + email + '"';
			return connection.query(queryString);
		},
		checkProfileCompletionById: function(userId) {
			var queryString = 'SELECT username FROM user WHERE user_id="' + userId + '"';
			return connection.query(queryString);
		},
		registerUser: function(user) {
			var values = '"' + user.email + '",' +
			             '"' + user.password + '",' +
			             '"' + user.accountStatus + '",' +
			             '"' + 1 + '",' +
			             '"0.0.0.0",' +
			             '"ESFJ",' +
			             '"' + 0 + '",' + 
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             'NOW() + INTERVAL 1 MONTH,' +
			             '"' + genericConsntants.IQ_MAX_QUESTIONS_FOR_NON_MEMBERS + '"' +
			             '"' + genericConsntants.GK_MAX_QUESTIONS_FOR_NON_MEMBERS + '"' +
						 '"' + genericConsntants.MATCH_MAX_TRIALS_FOR_NON_MEMBERS + '"';
			var queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.REGISTRATION_COLUMNS)
							.replace('$values', values);
			console.log(queryString);
			return connection.query(queryString);
		},
		activateAccount: function(userId) {
			var queryString = 'UPDATE user SET account_status="ACTIVE" WHERE user_id="' + userId + '"';
			return connection.query(queryString);
		},
		checkEmailExistence: function() {
			
		}
	};
};