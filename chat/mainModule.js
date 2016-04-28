angular
.module('mainModule', ['ui.router', 'ngStorage', 'loginModule', 'chatModule'])
.config(['$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
     url: '/login',
     templateUrl: 'login/login.html',
     controller: 'loginController'
	})
	.state('registration', {
	 url: '/registration',
     templateUrl: 'login/registration.html',
     controller: 'loginController'
	})
	.state('chat', {
     url: '/chat',
     templateUrl: 'chat/chat.html',
     controller: 'chatController'
	});

	$urlRouterProvider.otherwise('/login');
}]);