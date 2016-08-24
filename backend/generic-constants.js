module.exports = function() {
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
		STATISTICS_URL: 		'/auth/statistics',
		GET_HASH_URL: 			'/auth/getHash',
		CHECK_HASH_URL: 		'/auth/checkHash',

		NEXT_PERSONALITY_QUESTION_URL: 		'/personality/nextQuestion',
		ANSWER_PERSONALITY_QUESTION_URL: 	'/personality/answerQuestion',

		RANDOM_GK_QUESTION_URL: '/gk/randomQuestion',
		RANDOM_GK_QUESTION_FOR_PROFILE_URL: '/gk/randomProfileQuestion',
		ANSWER_GK_QUESTION_URL: '/gk/answerQuestion',
		ANSWER_GK_QUESTION_FOR_PROFILE_URL: '/gk/answerProfileQuestion',

		RANDOM_IQ_QUESTION_URL: '/iq/randomQuestion',
		RANDOM_IQ_QUESTION_FOR_PROFILE_URL: '/iq/randomProfileQuestion',
		ANSWER_IQ_QUESTION_URL: '/iq/answerQuestion',
		ANSWER_IQ_QUESTION_FOR_PROFILE_URL: '/iq/answerProfileQuestion',

		MYSQL_SOURCE: {
		    host: 		'localhost',
		    user: 		'root',
		    password: 	'1234',
		    database: 	'chat_database'
		},

		INSERT_TEMPLATE: 	'INSERT INTO $table ($columns) VALUES ($values) ',
		SELECT_TEMPLATE: 	'SELECT $columns FROM $table ',
		UPDATE_TEMPLATE: 	'UPDATE $table SET $map ',
		CRITERIA_TEMPLATE:  'WHERE $criteria ',

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
		GET_USER_DATA_BY_EMAIL_QUERY: 'SELECT username, password, account_status, remaining_iq_questions, remaining_gk_questions, membership_expiration, currenct_gk_score, current_iq_score, current_personality FROM user WHERE email="$email"',
		REGISTER_USER_QUERY: 'INSERT INTO user (email, password, account_status, current_personality_question_id, current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers, correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers, total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, membership_expiration, remaining_iq_questions, remaining_gk_questions, remaining_match_trials) VALUES ("$email", "$password", "INACTIVE", "1", "0.0.0.0", "ESFJ", "0", "0", "0", "0", "0", "0", "0", "0", "90", "0", NOW() + INTERVAL 1 MONTH, "$remainingIqQuestions", "$remainingGkQuestions", "$remainingMatchTrials"'),

		GET_NEXT_PERSONALITY_QUESTION_QUERY: 'SELECT personality_question_id, personality_question, negatively_affected_type FROM user JOIN personality_questions ON (current_personality_question_id=personality_question_id) WHERE user_id="$userId"',
		UPDATE_NEXT_QUESTION_AND_PERSONALITY_QUERY: 'UPDATE user SET current_personality_question_id=current_personality_question_id+1, current_personality_raw="$currentPersonalityRaw", current_personality="$currentPersonality" WHERE user_id="$userId"',
		GET_CURRENT_PERSONALITY_ROW_QUERY: 'SELECT current_personality_raw FROM user WHERE user_id="$userId"',

		UPDATE_REMAINING_IQ_QUESTIONS_QUERY: 'UPDATE user SET remaining_iq_questions="$remainingIqQuestions"',
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
							  'LEFT JOIN iq_links l7 ON (i.iq_answer6 = l7.iq_links_id) WHERE i.iq_question_id="$questionId"'
		//users
		USER_COLUMNS: 'username, email, password, gender, birthdate, account_status,current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, membership_expiration,'
					+ ' last_login_date, remaining_iq_questions, remaining_gk_questions, remaining_match_trials',
		USER_COLUMNS_WITH_ID: 'user_id, username, email, password, gender, birthdate, account_status, current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, membership_expiration,'
					+ ' last_login_date, remaining_iq_questions, remaining_gk_questions, remaining_match_trials',
		REGISTRATION_COLUMNS: 'email, password, account_status, current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, membership_expiration,'
					+ ' remaining_iq_questions, remaining_gk_questions, remaining_match_trials',
		PROFILE_COLUMNS: 'username, birthdate, gender',
		USER_TABLE: 'user',

		//gk questions
		GK_QUESTION_COLUMNS: 'gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_COLUMNS_WITH_ID: 'gk_question_id, gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_TABLE: 'gk_questions',

		//iq questions
		IQ_QUESTION_COLUMNS: 'difficulty, iq_question, iq_answer1, iq_answer2, iq_answer3, iq_answer4, iq_answer5, iq_answer6, iq_correct_answer',
		IQ_QUESTION_COLUMNS_WITH_ID: 'iq_question_id, difficulty, iq_question, iq_answer1, iq_answer2, iq_answer3, iq_answer4, iq_answer5, iq_answer6, iq_correct_answer',
		IQ_QUESTION_TABLE: 'iq_questions',

		//iq question links
		IQ_LINK_COLUMNS: 'link',
		IQ_LINK_COLUMNS_WITH_ID: 'iq_link_id, link',
		IQ_LINK_TABLE: 'iq_links',

		//gk question user
		GK_QUESTION_USER_COLUMNS: 'user_id, gk_question_id',
		GK_QUESTION_USER_COLUMNS_WITH_ID: 'gk_question_user_id, user_id, gk_question_id',
		GK_QUESTION_USER_TABLE: 'gk_question_user',

		//iq question user
		IQ_QUESTION_USER_COLUMNS: 'user_id, iq_question_id',
		IQ_QUESTION_USER_COLUMNS_WITH_ID: 'iq_question_user_id, user_id, iq_question_id',
		IQ_QUESTION_USER_TABLE: 'iq_question_user',

		//categories
		CATEGORY_COLUMNS: 'category',
		CATEGORY_COLUMNS_WITH_ID: 'category_id, category',
		CATEGORY_TABLE: 'category',

		//personality questions
		PERSONALITY_QUESTION_COLUMNS: 'personality_question, negatively_affected_type',
		PERSONALITY_QUESTION_COLUMNS_WITH_ID: 'personality_question_id, personality_question, negatively_affected_type',
		PERSONALITY_QUESTIONS_TABLE: 'personality_questions',

		//conversation history
		CONVERSATION_HISTORY_COLUMNS: 'first_user_id, second_user_id, engage_date',
		CONVERSATION_HISTORY_COLUMNS_WITH_ID: 'conversation_history_id, first_user_id, second_user_id, engage_date',
		CONVERSATION_HISTORY_TABLE: 'conversation_history',

		IQ_MAX_QUESTIONS_FOR_NON_MEMBERS: 5,
		GK_MAX_QUESTIONS_FOR_NON_MEMBERS: 10,
		MATCH_MAX_TRIALS_FOR_NON_MEMBERS: 10,

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
	}

};