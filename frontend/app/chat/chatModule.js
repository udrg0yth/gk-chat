angular.module('chatModule', ['ui.router'])
.config(function($httpProvider, $stateProvider, $urlRouterProvider){
	
	$stateProvider
		.state('chat',  {
				url: '/chat',
	 		 	templateUrl: 'chat.html',
			 	controller: 'chatController'
		});

})
.run(function(){
});

