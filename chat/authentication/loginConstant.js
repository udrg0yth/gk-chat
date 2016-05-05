angular.module('loginModule').constant('loginConstant', {
	authBaseUrl: 'http://localhost:8080',
	loginUrl: '/login',
	registrationUrl: '/register',
	verifyTokenUrl: '/verifyToken',
	checkUsernameUrl: '/usernameUse',
	checkEmailUrl: '/emailUse'
});