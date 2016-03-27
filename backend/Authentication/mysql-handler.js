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
			             '"' + user.account_status + '"';
			var queryString = authConst
							.insertTemp
							.replace('$table', authConst.userTable)
							.replace('$columns', authConst.userColumns)
							.replace('$values', values);
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