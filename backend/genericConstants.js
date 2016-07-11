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
		SUBTRACT_CREDITS_URL: 	'/match/subtractCredits',
		RESEND_EMAIL_URL: 		'/auth/resendEmail',
		
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
		USER_COLUMNS: 'username, email, password, gender, birthdate, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score',
		USER_COLUMNS_WITH_ID: 'user_id, username, email, password, gender, birthdate, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score',
		REGISTRATION_COLUMNS: 'email, password, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers, current_iq_score, current_gk_score',
		PROFILE_COLUMNS: 'username, birthdate, gender',
		USER_TABLE: 'user',

		//gk questions
		GK_QUESTION_COLUMNS: 'gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_COLUMNS_WITH_ID: 'gk_question_id, gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		GK_QUESTION_TABLE: 'gk_questions',

		//categories
		CATEGORY_COLUMNS: 'category',
		CATEGORY_COLUMNS_WITH_ID: 'category_id, category',
		CATEGORY_TABLE: 'category',

		//personality questions
		PERSONALITY_QUESTION_COLUMNS: 'personality_question, negatively_affected_type',
		PERSONALITY_QUESTION_COLUMNS_WITH_ID: 'personality_question_id, personality_question, negatively_affected_type',
		PERSONALITY_QUESTIONS_TABLE: 'personality_questions',
	}

};