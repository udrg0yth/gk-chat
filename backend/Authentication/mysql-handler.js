module.exports = function(app,
						  authConst) {

	var mysql      = require('promise-mysql');
	var connection;

	mysql.createConnection(authConst.mysqlSource)
	.then(function(conn){
	    connection = conn;
	});

	function retrieveUserByTemplate(column, data) {
		var queryString = authConst
						.selectTemp
						.replace('$columns', authConst.userColumns)
						.replace('$table', authConst.userTable)
					   + authConst.criteriaTemp
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
			var queryString = authConst
							.insertTemp
							.replace('$table', authConst.userTable)
							.replace('$columns', authConst.userColumns)
							.replace('$values', values);
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