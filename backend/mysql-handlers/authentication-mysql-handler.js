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
		saveUser: function(user) {
			var values = '"' + user.username + '",' +
			             '"' + user.password + '",' +
			             '"' + user.email + '",' +
			             '"' + user.birthdate + '",' +
			             '"' + user.account_status + '",' +
			             '"' + 150 + '",' +
			             '"' + 1 + '",' +
			             '"0.0.0.0",' +
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
							.replace('$columns', genericConstants.USER_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);
		},
		registerUser: function(user) {
			var values = '"' + user.email + '",' +
			             '"' + user.password + '",' +
			             '"' + user.accountStatus + '",' +
			             '"' + 150 + '",' +
			             '"' + 1 + '",' +
			             '"0.0.0.0",' +
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