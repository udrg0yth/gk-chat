angular
.module('mainModule', ['ui.router', 'ngStorage', 'loginModule', 'chatModule', 'base64'])
.config(['$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
     url: '/login',
     templateUrl: '/main.html',
     controller: 'loginController'
	})
	.state('registration', {
	 url: '/registration',
     templateUrl: 'authentication/registration.html',
     controller: 'loginController'
	})
	.state('chat', {
     url: '/chat',
     templateUrl: 'chat/chat.html',
     controller: 'chatController'
	});

	$urlRouterProvider.otherwise('/login');
}]);