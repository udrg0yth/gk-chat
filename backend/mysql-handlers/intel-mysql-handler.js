module.exports = function(genericConstants, connection) {
	return  {
		countQuestions: function() {
		  var queryString = 'SELECT count(*) AS questionCount FROM ' + genericConstants.IQ_QUESTION_TABLE;
		  return connection.query(queryString);
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
							.replace('$columns', 'current_timestamp - t1.timestamp as diftime, t2.difficulty, t1.iq_question_id, l1.link as question, ' +
								't2.iq_answer1 as iq_answer1Id, l2.link as answer1, t2.iq_answer2 as iq_answer2Id, l3.link as answer2, ' + 
								't2.iq_answer3 as iq_answer3Id, l4.link as answer3, t2.iq_answer4 as iq_answer4Id, l5.link as answer4, ' +
								't2.iq_answer5 as iq_answer5Id, l6.link as answer5, t2.iq_answer6 as iq_answer6Id, l7.link as answer6, ' +
								't2.iq_correct_answer as correctAnswerId')
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 't1.user_id="' + userId + '"');
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
							.replace('$columns', 'i.iq_question_id, i.difficulty, l1.link as question,i.iq_answer1 as iq_answer1Id, l2.link as answer1, ' + 
								'i.iq_answer2 as iq_answer2Id, l3.link as answer2, i.iq_answer3 as iq_answer3Id, l4.link as answer3, ' +
								'i.iq_answer4 as iq_answer4Id, l5.link as answer4, i.iq_answer5 as iq_answer5Id, l6.link as answer5, ' + 
								'i.iq_answer6 as iq_answer6Id, l7.link as answer6, i.iq_correct_answer as correctAnswerId')
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
			console.log(queryString);
			return connection.query(queryString);
		},
		removeTimeout: function(userId) {
			var queryString = 'DELETE FROM ' + genericConstants.IQ_QUESTION_USER_TABLE + ' ' +
						     genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
							console.log(queryString);
			return connection.query(queryString);
		},
		updateUserScore: function(userId, difficulty, isCorrect) {
			var map = '';
			switch(difficulty) {
				case 0:
					map = map + 'correct_easy_iq_answers = correct_easy_iq_answers + ' + (isCorrect?'1':'0') + ', ';
				break;
				case 1:
					map = map +'correct_medium_iq_answers = correct_medium_iq_answers + ' + (isCorrect?'1':'0') + ', ';
				break;
				case 2:
					map = map + 'correct_hard_iq_answers = correct_hard_iq_answers + ' + (isCorrect?'1':'0') + ', ';
				break;
				default:
					map = '';
			};

			map += 'remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0)';
			
			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			console.log(queryString);
			return connection.query(queryString);
		},
		updateUserScoreGlobal: function(difficulty, timeout) {
			var map = (difficulty == 0?'total_easy_iq_answers = total_easy_iq_answers + 1, current_iq_score = current_iq_score - ((correct_easy_iq_answers/(total_easy_iq_answers*(total_easy_iq_answers+1)))*60),': '') +
					  (difficulty == 1?'total_medium_iq_answers = total_medium_iq_answers + 1, current_iq_score = current_iq_score - ((correct_medium_iq_answers/(total_medium_iq_answers*(total_medium_iq_answers+1)))*30),': '') +
					  (difficulty == 2?'total_hard_iq_answers = total_hard_iq_answers + 1, current_iq_score = current_iq_score - ((correct_hard_iq_answers/(total_hard_iq_answers*(total_hard_iq_answers+1)))*30),': '') +
					  'remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0)';
			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id IN ( ')
						    + genericConstants
						    .SELECT_TEMPLATE
						    .replace('$table', genericConstants.GK_QUESTION_USER_TABLE)
						    .replace('$columns', 'user_id')
						    + genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'current_timestamp - timestamp > ' + timeout)
							+ ')';
			console.log(queryString);
			return connection.query(queryString);
		},
		removeTimedOutQuestions: function(timeout) {
			var quryString = 'DELETE FROM ' + genericConstants.GK_QUESTION_USER_TABLE + ' ' +
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id IN (')
							+ genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_USER_TABLE + ' JOIN ' + genericConstants.GK_QUESTION_TABLE
							 + ' USING (gk_question_id)')
							.replace('$columns', 'user_id')
							+ genericConstants.
							CRITERIA_TEMPLATE
							.replace('$criteria', 'current_timestamp - timestamp > ' + timeout)
							+ ')';
			console.log(queryString);
			return connection.query(queryString);
		},
	};
};