angular
.module('mainModule', ['ui.router', 'ngStorage', 'loginModule', 'chatModule', 'base64', 'mgo-angular-wizard'])
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