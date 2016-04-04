module.exports = function() {
	// to break down into files
	return {
		//url
		'updateUrl': '/updateQuestion',
		'insertUrl': '/insertQuestion',
		'getAllUrl': '/getQuestions',
		//mysql connection
		'mysqlSource': {
		    host: 'localhost',
		    user: 'root',
		    password: '1234',
		    database: 'chat_database'
		},
		'insertTemp': 'INSERT INTO $table ($columns) VALUES ($values) ',
		'selectTemp' : 'SELECT $columns FROM $table',
		'questionsColumns' : 'question_id, answer1, answer2, answer3, correct_answer ',
		'criteriaTemp': 'WHERE $criteria ',
		'questionsTable': 'gk_questions'
	};
};