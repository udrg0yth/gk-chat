angular
.module('mainModule', ['ui.router', 'ngStorage', 'loginModule', 'chatModule', 'base64', 'mgo-angular-wizard', 'ui.bootstrap'])
.config(['$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('main', {
		url: '/main',
      	views: {
    		mainView : {
      			templateUrl: 'main.html'
      		}
     	 }
	})
	.state('login', {
     url: '/login',
     parent: 'main',
     templateUrl: 'authentication/login.html',
     controller: 'loginController'
	})
	.state('mailSent', {
		url: '/mail',
		parent: 'main',
		templateUrl: 'authentication/mail.html',
		controller: 'loginController'
	})
	.state('completeProfile', {
		url: '/complete/:userHash',
		parent: 'main',
		templateUrl: 'authentication/profile.html',
		controller: 'loginController'
	})
	.state('registration', {
	 url: '/registration',
	 parent: 'main',
     templateUrl: 'authentication/registration.html',
     controller: 'loginController'
	})
	.state('chat', {
     controller: 'chatController',
     url: '/chat',
	      views: {
	    		mainView : {
	      			templateUrl: 'chat/chat.html'
	      		}
	      }
	});

	$urlRouterProvider.otherwise('/main/login');
}]);