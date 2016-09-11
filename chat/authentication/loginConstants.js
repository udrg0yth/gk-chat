angular.module('loginModule').constant('loginConstant', {
	LOGIN_URL: '/auth/login',
	SET_PROFILE: '/auth/setProfile',
	GET_PROFILE_QUESTIONS: '/auth/getProfileQuestions',
	REGISTRATION_URL: '/auth/register',
	VERIFY_TOKEN_URL: '/auth/verifyToken',
	CHECK_USERNAME_URL: '/auth/usernameUse',
	CHECK_EMAIL_URL: '/auth/emailUse',
	ACTIVATE_ACCOUNT_URL: '/auth/activateAccount',
	RESEND_EMAIL_URL: '/auth/resendEmail',
	GET_HASH_URL: 	'/auth/getHash',
	CHECK_HASH_URL: '/auth/checkHash'
});