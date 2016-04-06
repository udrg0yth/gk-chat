angular.module('mainModule', ['loginModule', 'chatModule', 'adminModule', 'ngStorage'])
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/admin');
})
.run(function(){

});

