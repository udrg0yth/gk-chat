module.exports = function(app,
						  gkConst) {

	var mysql      = require('promise-mysql');
	var connection;

	mysql.createConnection(gkConst.mysqlSource)
	.then(function(conn){
	    connection = conn;
	});

	return {
		'getAll' : function() {
			var queryString = gkConst
						.selectTemp
						.replace('$columns', gkConst.questionsColumns)
						.replace('$table', gkConst.questionsTable);
			return connection.query(queryString);
		},
		'saveQuestion': function(data) {
			var values = '"' + data.question + '",' +
			             '"' + data.answer1 + '",' +
			             '"' + data.answer2 + '",' +
			             '"' + data.answer3 + '"' +
			             '"' + data.correct_answer + '"';
			var queryString = gkConst
							.insertTemp
							.replace('$table', gkConst.questionsTable)
							.replace('$columns', gkConst.questionsColumns)
							.replace('$values', values);
			return connection.query(queryString);
		},
		'updateQuestion': function(data) {
			var queryString = 'UPDATE ' 
							+ gkConst.questionsTable + ' SET '
							+ 'question="' + data.question + '", '
							+ 'answer1="' + data.answer1 + '", '
							+ 'answer2="' + data.answer2 + '", '
							+ 'answer3="' + data.answer3 + '", '
							+ 'correct_answer="' + data.correct_answer + '" '
							+ 'category="' + data.category + '" '
							+ 'WHERE question_id=' + data.question_id;
			return connection.query(queryString);
		}
	};

};