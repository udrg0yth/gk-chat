angular.module('adminModule', [])
.config(function($httpProvider, $stateProvider, $urlRouterProvider){
	
	$stateProvider
		.state('admin',  {
				url: '/admin',
	 		 	templateUrl: 'admin.html',
			 	controller: 'adminController'
		})
})
.run(function(){
});