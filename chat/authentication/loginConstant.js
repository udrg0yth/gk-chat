angular.module('loginModule').constant('loginConstant', {
	BASE_URL: 'http://localhost:8080',
	LOGIN_URL: '/auth/login',
	REGISTRATION_URL: '/auth/register',
	VERIFY_TOKEN_URL: '/auth/verifyToken',
	CHECK_USERNAME_URL: '/auth/usernameUse',
	CHECK_EMAIL_URL: '/auth/emailUse',
	ACTIVATE_ACCOUNT_URL: '/auth/activateAccount',
	RESEND_EMAIL_URL: '/auth/resendEmail'
});