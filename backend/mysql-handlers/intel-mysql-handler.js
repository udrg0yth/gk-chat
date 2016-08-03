module.exports = function(genericConstants, connection) {
	return  {
		countQuestions: function() {
		  var queryString = 'SELECT count(*) AS questionCount FROM ' + genericConstants.IQ_QUESTION_TABLE;
		   connection.query(queryString);
		}, 
		getQuestionForUser: function(userId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_USER_TABLE + ' t1 JOIN ' + genericConstants.IQ_QUESTION_TABLE
							 + ' t2 ON (t1.iq_question_id = t2.iq_question_id) LEFT JOIN ' +
								genericConstants.IQ_LINK_TABLE + ' l1 ON (t2.iq_question = l1.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l2 ON (t2.iq_answer1 = l2.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l3 ON (t2.iq_answer2 = l3.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l4 ON (t2.iq_answer3 = l4.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l5 ON (t2.iq_answer4 = l5.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l6 ON (t2.iq_answer5 = l6.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l7 ON (t2.iq_answer6 = l7.iq_links_id)')
							.replace('$columns', 't1.timestamp, t1.iq_question_id, l1.link as question,l2.link as answer1, l3.link as answer2,'
								+'l4.link as answer3, l5.link as answer4, l6.link as answer5, l7.link as answer6')
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 't1.user_id="' + userId + '"');
			console.log(queryString);
			return connection.query(queryString);
		},
		getQuestionById: function(questionId) {
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_TABLE + ' i LEFT JOIN ' +
								genericConstants.IQ_LINK_TABLE + ' l1 ON (i.iq_question = l1.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l2 ON (i.iq_answer1 = l2.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l3 ON (i.iq_answer2 = l3.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l4 ON (i.iq_answer3 = l4.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l5 ON (i.iq_answer4 = l5.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l6 ON (i.iq_answer5 = l6.iq_links_id) ' +
								'LEFT JOIN ' + genericConstants.IQ_LINK_TABLE + ' l7 ON (i.iq_answer6 = l7.iq_links_id)')
							.replace('$columns', 'i.iq_question_id, l1.link as question,l2.link as answer1, l3.link as answer2,' +
								+'l4.link as answer3, l5.link as answer4, l6.link as answer5, l7.link as answer6')
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'i.iq_question_id="' + questionId + '"');
			return connection.query(queryString);
		},
		setTimeout: function(userId, questionId) {
			var values = '"' + userId + '",' +
 					 	 '"' + questionId +'"',
				queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.IQ_QUESTION_USER_TABLE)
							.replace('$columns', genericConstants.IQ_QUESTION_USER_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);
		},
		removeTimeout: function(userId) {
			var quryString = 'DELETE FROM ' + genericConstants.IQ_QUESTION_USER_TABLE + ' ' +
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
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
				break;
			};
			
			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'userId="' + userId + '"');
			return connection.query(queryString);
		}
	};
};