module.exports = function(genericConstants) {

	var mysql      = require('promise-mysql');
	var connection;

	mysql.createConnection(genericConstants.MYSQL_SOURCE)
	.then(function(conn){
	    connection = conn;
	});

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
		saveQuestion: function(question) {
			var queryString = 'INSERT INTO gk_questions (gk_question, gk_answer1, gk_answer2, ' +
			'gk_answer3, gk_answer4, category_id) values ("' +  question.question + '","' + question.answer1 + '","' +
			question.answer2 + '","' + question.answer3 + '","' + question.answer4 + '","' + question.category + '")';
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