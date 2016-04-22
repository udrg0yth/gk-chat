angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService',
function($scope, $state, loginService) {
	$scope.user = {};
	
	$scope.goRegister = function() {
		$state.go('registration');
	};

	$scope.register = function() {
		console.log($scope.user);
		$state.go('chat');
	};

}]);