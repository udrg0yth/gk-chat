module.exports = function(genericConstants, connection) {
	

	function retrieveUserByTemplate(column, data) {
		var queryString = genericConstants
						.SELECT_TEMPLATE
						.replace('$columns', genericConstants.USER_COLUMNS_WITH_ID)
						.replace('$table', genericConstants.USER_TABLE)
					   + genericConstants.CRITERIA_TEMPLATE
						.replace('$criteria', column + '="' + data + '"');
		console.log(queryString);
		return connection.query(queryString);
	};

	
	return {
		gatherPersonalityStatistics: function() {
	    	var queryString = 'SELECT current_personality as personality, count(*) AS count FROM ' + genericConstants.USER_TABLE
			   + ' GROUP BY current_personality';
			return connection.query(queryString);
		},
		gatherGeneralKnowledgeStatistics: function() {
			var queryString = 'SELECT FORMAT(STD(current_gk_score),2) AS standardDeviation, '
		 	   + 'AVG(current_gk_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
		 	return connection.query(queryString);
		},
		gatherIQStatistics: function() {
			var queryString = 'SELECT FORMAT(STD(current_iq_score),2) AS standardDeviation, '
		 	   + 'AVG(current_iq_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
		  return connection.query(queryString);
		},
		gatherGenderStatistics: function() {
		  	var queryString = 'SELECT gender, count(*) AS count FROM ' + genericConstants.USER_TABLE
			   + ' GROUP BY gender';
			return connection.query(queryString);	   
		},
		setUserProfile: function(userId, profile) {
			var map = 'username="'  + profile.username + '",' +
			          'birthdate="' + profile.birthdate + '",' +
			          'gender="'    + profile.gender + '"';

			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.PROFILE_COLUMNS)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		},
		getIdFromEmail: function(email) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', 'user_id')
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'email="' + email + '"');
			console.log(queryString);
			return connection.query(queryString);
		},
		checkProfileCompletionById: function(id) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', 'username')
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + id + '"');
			console.log(queryString);
			return connection.query(queryString);
		},
		registerUser: function(user) {
			var values = '"' + user.email + '",' +
			             '"' + user.password + '",' +
			             '"' + user.accountStatus + '",' +
			             '"' + 150 + '",' +
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
			             '"' + 0 + '"';
			var queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.REGISTRATION_COLUMNS)
							.replace('$values', values);
			console.log(queryString);
			return connection.query(queryString);
		},
		activateAccount: function(userId) {
			var map = 'account_status="ACTIVE"',
				queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
						 +    genericConstants
						 	.CRITERIA_TEMPLATE
						 	.replace('$criteria', 'user_id="' + userId + '"');
			console.log(queryString);
			return connection.query(queryString);
		},
		retrieveUserById: function(userId) {
			return retrieveUserByTemplate('user_id', userId);
		},
		retrieveUserByEmail: function(email) {
			return retrieveUserByTemplate('email', email);
		},
		retrieveUserByUsername: function(username) {
			return retrieveUserByTemplate('username', username);
		}
	};
};