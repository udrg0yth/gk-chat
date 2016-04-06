angular.module('adminModule').controller('adminController',['$scope', '$state', 'adminService',  function($scope, $state, adminService){
		 adminService
		.getAllQuestions()
		.success(function(data) {

		})
		.error(function(error) {

		});
}])