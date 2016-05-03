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
		subtractCreditsUrl: '/subtractCredits'
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
		userColumns: 'username, password, email, account_status, credits, last_personality_question_id,'
					+ ' current_personality, correct_easy_iq_answers, total_easy_iq_answers,'
					+ ' correct_medium_iq_answers, total_medium_iq_answers, correct_hard_iq_answers,'
					+ ' total_hard_iq_answers, correct_gk_answers, total_gk_answers',
		userTable: 'user',
		//token constants
		tokenOpt: { 
			algorithm: 'RS256', 
			expiresIn: 60 
		},
		//Exception/error messages
		NOT_ENOUGH_CREDITS: new Error('NOT_ENOUGH_CREDITS'),
		INCOMPLETE_DATA: new Error('INCOMPLETE_DATA'),
		BAD_CREDENTIALS: new Error('BAD_CREDENTIALS'),
		INACTIVE_ACCOUNT: new Error('INACTIVE_ACCOUNT'),
		EMAIL_IN_USE: new Error('EMAIL_IN_USE'),
		USERNAME_IN_USE: new Error('USERNAME_IN_USE'),
	};
};