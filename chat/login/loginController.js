angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService',
function($scope, $state, loginService) {
	$scope.user = {};
	$scope.errorMessage = '';
	$scope.showErrorMessage = false;

	$scope.login = function() {
		$scope.errorMessage = ' Wrong username or password!';
		$scope.showErrorMessage = !$scope.showErrorMessage;
	};

	$scope.goRegister = function() {
		$state.go('registration');
	};

	$scope.register = function() {
		console.log($scope.user);
		$state.go('chat');
	};

}]);