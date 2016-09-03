module.exports = function(constantValues) {
	// to break down into files
	return {
		//http status
		OK : 			200,
		UNAUTHORIZED: 	401,
		FORBIDDEN: 		403,
		INTERNAL_ERROR: 500,
		CONFLICT: 		409,

		LOGIN_URL: 				'/auth/login',
		LOGOUT_URL: 			'/auth/logout',
		REGISTRATION_URL:   	'/auth/register',
		USERNAME_CHECK_URL: 	'/auth/usernameUse',
		EMAIL_CHECK_URL: 		'/auth/emailUse',
		VERIFY_TOKEN_URL: 		'/auth/verifyToken',
		ACTIVATE_ACCOUNT_URL:   '/auth/activateAccount',
		RESEND_EMAIL_URL: 		'/auth/resendEmail',
		SET_PROFILE_URL:        '/auth/setProfile',
		GET_PROFILE_QUESTIONS_URL: '/auth/getProfileQuestions',
		STATISTICS_URL: 		'/auth/statistics',
		GET_HASH_URL: 			'/auth/getHash',
		CHECK_HASH_URL: 		'/auth/checkHash',

		NEXT_PERSONALITY_QUESTION_URL: 		'/personality/nextQuestion',
		ANSWER_PERSONALITY_QUESTION_URL: 	'/personality/answerQuestion',

		RANDOM_GK_QUESTION_URL: '/gk/randomQuestion',
		ANSWER_GK_QUESTION_URL: '/gk/answerQuestion',

		RANDOM_IQ_QUESTION_URL: '/iq/randomQuestion',
		ANSWER_IQ_QUESTION_URL: '/iq/answerQuestion',

		MYSQL_SOURCE: {
		    host: 		'localhost',
		    user: 		'root',
		    password: 	'1234',
		    database: 	'chat_database'
		},

		PERONALITY_STATISTICS_QUERY: 'SELECT current_personality as personality, count(*) AS count FROM user GROUP BY current_personality',
		GENERAL_KNOWLEDGE_STATISTICS_QUERY: 'SELECT FORMAT(STD(current_gk_score),2) AS standardDeviation, AVG(current_gk_score) AS averageScore FROM user',
		IQ_STATISTICS_QUERY: 'SELECT FORMAT(STD(current_iq_score),2) AS standardDeviation, AVG(current_iq_score) AS averageScore FROM user',
		COUNT_IQ_QUESTIONS_QUERY: 'SELECT count(*) AS questionCount FROM iq_questions',
		COUNT_GK_QUESTIONS_QUERY: 'SELECT count(*) AS questionCount FROM gk_questions',

		SET_USER_PROFILE_QUERY: 'UPDATE user SET username="$username", birthdate="$birthdate", gender="$gender",last_login_date=NOW() WHERE user_id="$userId"',
		GET_ID_FROM_EMAIL_QUERY: 'SELECT user_id FROM user WHERE email="$email"',
		GET_EMAIL_FROM_ID_QUERY: 'SELECT email FROM user where user_id="$userId"',
		CHECK_PROFILE_COMPLETION_QUERY: 'SELECT username FROM user WHERE user_id="$userId"',
		ACTIVATE_ACCOUNT_QUERY: 'UPDATE user SET account_status="ACTIVE" WHERE user_id="$userId"',
		CHECK_EMAIL_EXISTENCE_QUERY: 'SELECT email FROM user WHERE email="$email"',
		CHECK_USERNAME_EXISTENCE_QUERY: 'SELECT username FROM user WHERE username="$username"',
		GET_ACCOUNT_STATUS_QUERY: 'SELECT account_status FROM user WHERE user_id="$userId"',
		GET_USER_DATA_BY_EMAIL_QUERY: 'SELECT username, password, account_status, remaining_iq_questions, remaining_gk_questions, membership_expiration, ' + 
									'current_gk_score, current_iq_score, current_personality FROM user WHERE email="$email"',
		REGISTER_USER_QUERY: 'INSERT INTO user (email, password, account_status, current_personality_question_id, current_personality_raw, current_personality, ' + 
							'correct_easy_iq_answers, total_easy_iq_answers, correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers, total_hard_iq_answers, ' + 
							'correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, membership_expiration, remaining_iq_questions, remaining_gk_questions, ' + 
							'remaining_match_trials) VALUES ("$email", "$password", "INACTIVE", "1", "0.0.0.0", "ESFJ", "0", "0", "0", "0", "0", "0", "0", "0", "90", "0", NOW() + ' + 
							'INTERVAL 1 MONTH, "' + constantValues.IQ_MAX_QUESTIONS_FOR_NON_MEMBERS + '", "' + constantValues.GK_MAX_QUESTIONS_FOR_NON_MEMBERS + '", "' + 
							constantValues.MATCH_MAX_TRIALS_FOR_NON_MEMBERS + '")',

		GET_NEXT_PERSONALITY_QUESTION_QUERY: 'SELECT personality_question_id, personality_question, negatively_affected_type FROM user JOIN personality_questions ON ' + 
											'(current_personality_question_id=personality_question_id) WHERE user_id="$userId"',
		UPDATE_NEXT_QUESTION_AND_PERSONALITY_QUERY: 'UPDATE user SET current_personality_question_id=current_personality_question_id+1, current_personality_raw="$currentPersonalityRaw", ' + 
										'current_personality="$currentPersonality" WHERE user_id="$userId"',
		GET_CURRENT_PERSONALITY_ROW_QUERY: 'SELECT current_personality_raw FROM user WHERE user_id="$userId"',

		UPDATE_REMAINING_IQ_QUESTIONS_QUERY: 'UPDATE user SET remaining_iq_questions="' + constantValues.IQ_MAX_QUESTIONS_FOR_NON_MEMBERS + '"',
		GET_REMAINING_IQ_QUESTIONS_FOR_USER: 'SELECT remaining_iq_questions FROM user WHERE user_id="$userId"',
		GET_IQ_QUESTION_FOR_USER_QUERY: 'SELECT current_timestamp - t1.timestamp as diftime, t2.difficulty, t1.iq_question_id, l1.link as question, ' +
							  't2.iq_answer1 as iq_answer1Id, l2.link as answer1, t2.iq_answer2 as iq_answer2Id, l3.link as answer2, ' + 
							  't2.iq_answer3 as iq_answer3Id, l4.link as answer3, t2.iq_answer4 as iq_answer4Id, l5.link as answer4, ' +
							  't2.iq_answer5 as iq_answer5Id, l6.link as answer5, t2.iq_answer6 as iq_answer6Id, l7.link as answer6, ' +
							  't2.iq_correct_answer as correctAnswerId FROM iq_question_user t1 JOIN iq_questions t2 ON ' + 
							  '(t1.iq_question_id = t2.iq_question_id) LEFT JOIN iq_links l1 ON (t2.iq_question = l1.iq_links_id) ' +
							  'LEFT JOIN iq_links l2 ON (t2.iq_answer1 = l2.iq_links_id) LEFT JOIN iq_links l3 ON (t2.iq_answer2 = l3.iq_links_id) ' +
							  'LEFT JOIN iq_links l4 ON (t2.iq_answer3 = l4.iq_links_id) LEFT JOIN iq_links l5 ON (t2.iq_answer4 = l5.iq_links_id) ' +
							  'LEFT JOIN iq_links l6 ON (t2.iq_answer5 = l6.iq_links_id) LEFT JOIN iq_links l7 ON (t2.iq_answer6 = l7.iq_links_id) ' +
							  'WHERE t1.user_id="$userId"',
		GET_IQ_QUESTION_BY_ID_QUERY: 'SELECT i.iq_question_id, i.difficulty, l1.link as question,i.iq_answer1 as iq_answer1Id, l2.link as answer1, ' + 
							  'i.iq_answer2 as iq_answer2Id, l3.link as answer2, i.iq_answer3 as iq_answer3Id, l4.link as answer3, ' +
							  'i.iq_answer4 as iq_answer4Id, l5.link as answer4, i.iq_answer5 as iq_answer5Id, l6.link as answer5, ' + 
							  'i.iq_answer6 as iq_answer6Id, l7.link as answer6, i.iq_correct_answer as correctAnswerId FROM ' +
							  'iq_questions i LEFT JOIN iq_links l1 ON (i.iq_question = l1.iq_links_id) LEFT JOIN iq_links l2 ON (i.iq_answer1 = l2.iq_links_id) ' +
							  'LEFT JOIN iq_links l3 ON (i.iq_answer2 = l3.iq_links_id) LEFT JOIN iq_links l4 ON (i.iq_answer3 = l4.iq_links_id) ' +
							  'LEFT JOIN iq_links l5 ON (i.iq_answer4 = l5.iq_links_id) LEFT JOIN iq_links l6 ON (i.iq_answer5 = l6.iq_links_id) ' +
							  'LEFT JOIN iq_links l7 ON (i.iq_answer6 = l7.iq_links_id) WHERE i.iq_question_id="$questionId"',
		SET_IQ_TIMEOUT_QUERY: 'INSERT INTO iq_question_user (user_id, iq_question_id) VALUES ("$userId","$questionId")',
		REMOVE_IQ_TIMEOUT_QUERY: 'DELETE FROM iq_question_user WHERE user_id="$userId"',
		UPDATE_USER_IQ_EASY_SCORE_QUERY: 'UPDATE user SET correct_easy_iq_answers = correct_easy_iq_answers + $isCorrect, total_easy_iq_answers = ' +
										'total_easy_iq_answers + 1, current_iq_score = current_iq_score + (correct_easy_iq_answers * (total_easy_iq_answers + 2) ' + 
										'+ (correct_easy_iq_answers + $isCorrect) * (total_easy_iq_answers+1))/((total_easy_iq_answers+1) * (total_easy_iq_answers+2)) * ' + 
										constantValues.EASY_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id="$userId"',
		UPDATE_USER_IQ_MEDIUM_SCORE_QUERY: 'UPDATE user SET correct_medium_iq_answers = correct_medium_iq_answers + $isCorrect, total_medium_iq_answers = ' + 
										'total_medium_iq_answers + 1, current_iq_score = current_iq_score + (correct_medium_iq_answers * (total_medium_iq_answers + 2) ' + 
										'+ (correct_medium_iq_answers + $isCorrect) * (total_medium_iq_answers+1))/((total_medium_iq_answers+1) * (total_medium_iq_answers+2)) * ' + 
										constantValues.MEDIUM_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id="$userId"',
		UPDATE_USER_IQ_HARD_SCORE_QUERY: 'UPDATE user SET correct_hard_iq_answers = correct_hard_iq_answers + $isCorrect, total_hard_iq_answers = ' + 
										'total_hard_iq_answers + 1, current_iq_score = current_iq_score + (correct_hard_iq_answers * (total_hard_iq_answers + 2) ' + 
										'+ (correct_hard_iq_answers + $isCorrect) * (total_hard_iq_answers+1))/((total_hard_iq_answers+1) * (total_hard_iq_answers+2)) * ' + 
										constantValues.HARD_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id ="$userId"',
		UPDATE_USER_IQ_EASY_SCORE_GLOBAL_QUERY: 'UPDATE user SET total_easy_iq_answers = total_easy_iq_answers + 1, current_iq_score = current_iq_score + (correct_easy_iq_answers * (total_easy_iq_answers + 2) ' + 
										'+ correct_easy_iq_answers * (total_easy_iq_answers+1))/((total_easy_iq_answers+1) * (total_easy_iq_answers+2)) * ' + 
										constantValues.EASY_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id IN ' +
										'(SELECT user_id FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_EASY + ')',
		UPDATE_USER_IQ_MEDIUM_SCORE_GLOBAL_QUERY: 'UPDATE user SET total_medium_iq_answers = total_medium_iq_answers + 1, current_iq_score = current_iq_score + (correct_medium_iq_answers * (total_medium_iq_answers + 2) ' + 
										'+ correct_medium_iq_answers * (total_medium_iq_answers+1))/((total_medium_iq_answers+1) * (total_medium_iq_answers+2)) * ' + 
										constantValues.MEDIUM_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id IN ' +
										'(SELECT user_id FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_MEDIUM + ')',
		UPDATE_USER_IQ_HARD_SCORE_GLOBAL_QUERY: 'UPDATE user SET total_hard_iq_answers = total_hard_iq_answers + 1, current_iq_score = current_iq_score + (correct_hard_iq_answers * (total_hard_iq_answers + 2) ' + 
										'+ correct_hard_iq_answers * (total_hard_iq_answers+1))/((total_hard_iq_answers+1) * (total_hard_iq_answers+2)) * ' + 
										constantValues.HARD_IQ_WEIGHT + ', remaining_iq_questions=IF(remaining_iq_questions>0,remaining_iq_questions-1, 0) WHERE user_id IN ' +
										'(SELECT user_id FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_HARD + ')',
		REMOVE_TIMED_OUT_IQ_EASY_QUESTIONS_GLOBAL_QUERY: 'DELETE FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_EASY,
		REMOVE_TIMED_OUT_IQ_MEDIUM_QUESTIONS_GLOBAL_QUERY: 'DELETE FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_MEDIUM,
		REMOVE_TIMED_OUT_IQ_HARD_QUESTIONS_GLOBAL_QUERY: 'DELETE FROM iq_question_user WHERE current_timestamp - timestamp > ' + constantValues.IQ_TIME_LIMIT_HARD,

		UPDATE_REMAINING_GK_QUESTIONS_QUERY: 'UPDATE user SET remaining_iq_questions="' + constantValues.GK_MAX_QUESTIONS_FOR_NON_MEMBERS + '"',
		GET_REMAINING_IQ_QUESTIONS_FOR_USER_QUERY: 'SELECT remaining_gk_questions FROM user WHERE user_id="$userId"',
		GET_GK_QUESTION_FOR_USER_QUERY: 'SELECT current_timestamp - timestamp as diftime, gk_question_id, gk_question, category, gk_answer1, ' + 
									'gk_answer2, gk_answer3, gk_answer4 FROM gk_question_user JOIN gk_questions USING(gk_question_id) JOIN ' + 
									'category USING(category_id) WHERE user_id="$userId"',
		GET_GK_QUESTION_BY_ID_QUERY: 'SELECT gk_question_id, gk_question, category, gk_answer1, gk_answer2, gk_answer3, gk_answer4 FROM gk_questions ' + 
									'JOIN category USING(category_id) WHERE gk_question_id="$questionId"',
		SET_GK_TIMEOUT_QUERY: 'INSERT INTO gk_question_user (user_id, gk_question_id) VALUES ("$userId","$questionId")',
		REMOVE_GK_TIMEOUT_QUERY: 'DELETE FROM gk_question_user WHERE user_id="$userId"',
		UPDATE_USER_GK_SCORE_QUERY: 'UPDATE user SET correct_gk_answers = correct_gk_answers + $isCorrect, ' + 
						'total_gk_answers = total_gk_answers + 1, current_gk_score = correct_gk_answers/total_gk_answers WHERE user_id="$userId"',
		UPDATE_USER_GK_SCORE_GLOBAL_QUERY: 'UPDATE user SET total_gk_answers = total_gk_answers + 1, current_gk_score = correct_gk_answers/total_gk_answers ' + 
						'WHERE user_id IN (SELECT user_id FROM gk_question_user WHERE current_timestamp - timestamp > ' + constantValues.GK_TIME_LIMIT + ')',
		REMOVE_TIMED_OUT_GK_QUESTIONS_GLOBAL_QUERY: 'DELETE FROM gk_question_user WHERE current_timestamp - timestamp > ' + constantValues.GK_TIME_LIMIT,

		//conversation history
		CONVERSATION_HISTORY_COLUMNS: 'first_user_id, second_user_id, engage_date',
		CONVERSATION_HISTORY_COLUMNS_WITH_ID: 'conversation_history_id, first_user_id, second_user_id, engage_date',
		CONVERSATION_HISTORY_TABLE: 'conversation_history',

		GET_VALUES: constantValues,

		INVALID_TOKEN: new Error('INVALID_TOKEN'),
		UNKNOWN_USER: new Error('UNKNOWN_USER'),
		INCOMPLETE_DATA: new Error('INCOMPLETE_DATA'),
		BAD_DATA: new Error('BAD_DATA'),
		NO_MORE_GK_QUESTIONS: new Error('NO_MORE_GK_QUESTIONS'),
		NO_MORE_IQ_QUESTIONS: new Error('NO_MORE_IQ_QUESTIONS'),
		NO_MORE_MATCHES: new Error('NO_MORE_MATCHES'),

		//crypto
		CRYPTO_ALGORITHM: 'aes-256-ctr',
		CRYPTO_SECRET: 'd6F3Efeq',

		GENERATE_RANDOM: function(max) {
			return Math.floor(Math.random() * max);
		},
		SHUFFLE_ARRAY: function (array) {
		    var counter = array.length;
		    while (counter > 0) {
		        var index = Math.floor(Math.random() * counter);
		        counter--;
		        var temp = array[counter];
		        array[counter] = array[index];
		        array[index] = temp;
		    }
		    return array;
		}

	};

};