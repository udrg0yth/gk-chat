module.exports = function() {
	return {
		//crypto
		CRYPTO_ALGORITHM: 'aes-256-ctr',
		CRYPTO_SECRET: 'd6F3Efeq',

		//email
		EMAIL_TEMPLATE: '<a href="http://localhost:9000/#/main/complete/$hash">Activate account</a>',

		//token constants
		TOKEN_OPTIONS: { 
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
		ACCOUNT_ALREADY_ACTIVE: new Error('ACCOUNT_ALREADY_ACTIVE'),
		INCOMPLETE_PROFILE: new Error('INCOMPLETE_PROFILE')
		
	};
};