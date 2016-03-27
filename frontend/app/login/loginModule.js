angular.module('loginModule', ['ui.router', 'base64'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('login',  {
				url: '/login',
	 		 	templateUrl: 'login.html',
			 	controller: 'loginController'
		})
		.state('register', {
				url: '/register',
				templateUrl: 'register.html',
				controller: 'registrationController'
		})

})
.run(function(){
});

