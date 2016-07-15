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

		SUBTRACT_CREDITS_URL: 	'/match/subtractCredits',

		NEXT_PERSONALITY_QUESTION_URL: '/personality/nextQuestion',
		ANSWER_PERSONALITY_QUESTION_URL: '/personality/answerQuestion',
		CURRENT_PERSONALITY_URL: '/personality',

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

		//users
		USER_COLUMNS: 'username, email, password, gender, birthdate, account_status, credits, current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, last_login_date',
		USER_COLUMNS_WITH_ID: 'user_id, username, email, password, gender, birthdate, account_status, credits, current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score, last_login_date',
		REGISTRATION_COLUMNS: 'email, password, account_status, credits, current_personality_question_id,'
					+ ' current_personality_raw, current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_scor, last_login_date',
		PROFILE_COLUMNS: 'username, birthdate, gender',
		USER_TABLE: 'user',

		//gk questions
		GK_QUESTION_COLUMNS: 'gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_COLUMNS_WITH_ID: 'gk_question_id, gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_TABLE: 'gk_questions',

		//iq questions
		IQ_QUESTION_COLUMNS: 'iq_question, iq_difficulty, iq_answer1, iq_answer2, iq_answer3, iq_answer4, iq_answer5, iq_answer6, iq_correct_answer',
		IQ_QUESTION_COLUMNS_WITH_ID: 'iq_question_id, iq_question, difficulty, iq_answer1, iq_answer2, iq_answer3, iq_answer4, iq_answer5, iq_answer6, iq_correct_answer',
		IQ_QUESTION_TABLE: 'iq_questions',

		//iq question links
		IQ_QUESTION_LINK_COLUMNS: 'link',
		IQ_QUESTION_LINK_COLUMNS_WITH_ID: 'iq_link_id, link',
		IQ_QUESTION_TABLE: 'iq_links',

		//gk question user
		GK_QUESTION_USER_COLUMNS: 'user_id, gk_question_id, timestamp',
		GK_QUESTION_USER_COLUMNS_WITH_ID: 'gk_question_user_id, user_id, gk_question_id, timestamp',
		GK_QUESTION_USER_TABLE: 'gk_question_user',

		//iq question user
		IQ_QUESTION_USER_COLUMNS: 'user_id, iq_question_id, timestamp',
		IQ_QUESTION_USER_COLUMNS_WITH_ID: 'iq_question_user_id, user_id, iq_question_id, timestamp',
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

		INVALID_TOKEN: new Error('INVALID_TOKEN'),
		UNKNOWN_USER: new Error('UNKNOWN_USER'),
		INCOMPLETE_DATA: new Error('INCOMPLETE_DATA'),

		GENERATE_RANDOM: function(max) {
			return Math.floor(Math.rand() * max);
		}
	}

};