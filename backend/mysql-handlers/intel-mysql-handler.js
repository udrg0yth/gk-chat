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
		getRandomQuestion: function() {
						genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_TABLE + ' i LEFT JOIN ' +
								genericConstants.IQ_LINKS_TABLE + ' l1 ON (i.iq_question = l1.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l2 ON (i.iq_answer1 = l2.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l3 ON (i.iq_answer2 = l3.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l4 ON (i.iq_answer3 = l4.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l5 ON (i.iq_answer4 = l5.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l6 ON (i.iq_answer5 = l6.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINKS_TABLE + ' l7 ON (i.iq_answer6 = l7.iq_links_id)')
							.replace('$columns', 'iq_questions_id, l1.link as question,l2.link as answer1, l3.link as answer2,' +
								+'l4.link as answer3, l5.link as answer4, l6.link as answer5, l7.link as answer6')
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