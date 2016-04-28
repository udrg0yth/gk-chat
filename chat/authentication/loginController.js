angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService', 'tokenService',
function($scope, $state, loginService, tokenService) {
	$scope.user = {};
	$scope.errorMessage = '';
	$scope.showErrorMessage = false;
	$scope.showUsernameSpinner = false;
	$scope.showEmailSpinner = false;

	if(tokenService.checkToken()) {
		$state.go('chat');
	}

	$scope.login = function() {
		$scope.showErrorMessage = false;
		loginService.authenticate($scope.user).success(function(data) {
 			if(data.token) {
 				$localStorage.token = data.token;
 			}

 		}).error(function(error) {
 			$scope.errorMessage = "Wrong username or password!";
 			$scope.showErrorMessage = true;
 		});
	};

	$scope.goRegister = function() {
		$state.go('registration');
	};

	$scope.register = function() {
		$state.go('chat');
	};

}]);