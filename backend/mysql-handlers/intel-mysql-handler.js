module.exports = function(genericConstants, connection) {
	var schedule = require('node-schedule'),
		count = 0;

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT count(*) AS questionCount FROM ' + genericConstants.IQ_QUESTION_TABLE;
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	count = rows[0].questionCount;
		  })
		  .catch(function(error) {
		  	console.lor('Error while counting iq questions!', error.message);
		  });
	});

	return  {
		getRandomQuestion: function() {s
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_TABLE + ' JOIN ')
							.replace('$columns', genericConstants.IQ_QUESTION_COLUMNS_WITH_ID)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'iq_question_id="' + genericConstants.GENERATE_RANDOM(count) + '"');
			return connection.query(queryString);
		},
		getQuestionForUser: function(userId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_USER_TABLE + ' JOIN ' + genericConstants.IQ_QUESTION_TABLE
							 + ' USING (iq_question_id)')
							.replace('$columns', 'timestamp, ' + genericConstants.IQ_QUESTION_COLUMNS)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'userId="' + userId + '"');
			return connection.query(queryString);
		},
		getQuestionById: function(questionId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_TABLE)
							.replace('$columns', genericConstants.IQ_QUESTION_COLUMNS)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'iq_question_id="' + questionId + '"');
			return connection.query(queryString);
		},
		updateUserScore: function(userId, difficulty, isCorrect) {
			var map = '';
			switch(difficulty) {
				case 0:
					map += 'correct_easy_iq_answers = correct_easy_iq_answers + ' + isCorrect?'1':'0' + ', ';
				break;
				case 1:
					map += 'correct_medium_iq_answers = correct_medium_iq_answers + ' + isCorrect?'1':'0' + ', ';
				break;
				case 2:
					map += 'correct_hard_iq_answers = correct_hard_iq_answers + ' + isCorrect?'1':'0' + ', ';
			}
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