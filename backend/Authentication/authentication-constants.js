module.exports = function() {
	// to break down into files
	return {
		//http status
		OK : 200,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		INTERNAL_ERROR: 500,
		CONFLICT: 409,
		//url
		loginUrl: '/login',
		logoutUrl: '/logout',
		registrationUrl: '/register',
		usernameCheckUrl: '/usernameUse',
		emailCheckUrl: '/emailUse',
		verifyTokenUrl: '/verifyToken',
		subtractCreditsUrl: '/subtractCredits',
		//mysql connection
		mysqlSource: {
		    host: 'localhost',
		    user: 'root',
		    password: '1234',
		    database: 'chat_database'
		},
		insertTemp: 'INSERT INTO $table ($columns) VALUES ($values) ',
		selectTemp: 'SELECT $columns FROM $table ',
		criteriaTemp: 'WHERE $criteria ',
		//users
		userColumns: 'username, email, password, gender, birthdate, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers',
		registrationColumns: 'email, password, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers',
		profileColumns: 'username, birthdate, gender',
		userTable: 'user',
		//gk questions
		gkQuestionsColumns: 'gk_question, category_id, gk_answer1, gk_answer2, gk_answer3, gk_answer4',
		gkQuestionsTable: 'gk_questions',
		CATEGORY_COLUMNS: 'category',
		CATEGORY_TABLE: 'category',
		//personality questions
		personalityQuestionsColumns: 'personality_question, negatively_affected_type',
		personalityQuestionsTable: 'personality_questions',
		//token constants
		tokenOpt: { 
			algorithm: 'RS256', 
			expiresIn: 60 
		},
		//Exception/error messages
		NOT_ENOUGH_CREDITS: new Error('NOT_ENOUGH_CREDITS'),
		INCOMPLETE_DATA: new Error('INCOMPLETE_DATA'),
		BAD_CREDENTIALS: new Error('BAD_CREDENTIALS'),
		TOKEN_EXPIRED: new Error('TOKEN_EXPIRED'),
		INACTIVE_ACCOUNT: new Error('INACTIVE_ACCOUNT'),
		EMAIL_IN_USE: new Error('EMAIL_IN_USE'),
		USERNAME_IN_USE: new Error('USERNAME_IN_USE'),

		PERSONALITY_TYPES: ['E','S','F','J','I','N','T','P']
	};
};