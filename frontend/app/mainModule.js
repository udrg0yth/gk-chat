angular.module('mainModule', ['loginModule', 'chatModule','ngStorage'])
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/chat');
})
.run(function(){

});

