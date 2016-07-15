module.exports = function(genericConstants, connection) {
	var schedule = require('node-schedule'),
		count = 0;

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT count(*) AS questionCount FROM ' + genericConstants.GK_QUESTION_TABLE;
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	count = rows[0].questionCount;
		  })
		  .catch(function(error) {
		  	console.lor('Error while counting gk questions!', error.message);
		  });
	});

	

	return  {
		getQuestionForUser: function(userId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_USER_TABLE + ' JOIN ' + genericConstants.GK_QUESTION_TABLE
							 + ' USING (gk_question_id)')
							.replace('$columns', 'timestamp, ' + genericConstants.GK_QUESTION_COLUMNS_WITH_ID)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'userId="' + userId + '"');
			return connection.query(queryString);
		},
		setTimeout: function(userId, questionId) {
			var values = '"' + userId '",'
					 =	 '"' + questionId +'"',
				queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_USER_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_USER_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);
		},
		getQuestionById: function(questionId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_COLUMNS)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'gk_question_id="' + questionId + '"');
			return connection.query(queryString);
		},
		updateUserScore: function(userId, isCorrect) {
			var map = 'correct_gk_answers = correct_gk_answers + ' + isCorrect?1:0 + 
			+ ', total_gk_answers = total_gk_answers + 1, current_gk_score = correct_gk_answers/total_gk_answers';

			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'userId="' + userId + '"');
			return connection.query(queryString);
		},
		saveQuestion: function(question) {
			var values = '"' + question.question + '",' +
						 '"' + question.answer1 + '",' +
						 '"' + question.answer2 + '",' +
						 '"' + question.answer3 + '",' +
						 '"' + question.answer4 + '",' +
						 '"' + question.category + '"',
				queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);			 
		}
	};
};