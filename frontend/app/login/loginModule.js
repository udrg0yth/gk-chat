angular.module('loginModule', ['ui.router'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.otherwise('/login');
	$stateProvider.state('login', 
		{url:'/login',
 		 templateUrl: 'login.html',
		 controller: 'loginController'}
		 )

})
.run(function(){
});

