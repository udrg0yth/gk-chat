angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage',
function($scope, $state, loginService, tokenService, $localStorage) {
	$scope.user = {};
	$scope.errorMessage = '';
	$scope.showErrorMessage = false;
	$scope.showUsernameSpinner = false;
	$scope.showEmailSpinner = false;

	if(tokenService.checkToken()) {
		//$state.go('chat');
	}

	$scope.login = function() {
		$scope.showErrorMessage = false;
		loginService.authenticate($scope.user).success(function(data) {
 			if(data.token) {
 				$localStorage.token = data.token;
 			}

 		}).success(function(data) {
 			if(data.token) {
 				$localStorage.token = data.token;
 			}
 		}).error(function(error) {
 			$scope.errorMessage = 'Wrong username or password!';
 			$scope.showErrorMessage = true;
 		});
	};

	$scope.goRegister = function() {
		$scope.showErrorMessage = false;
		$state.go('registration');
	};

	$scope.register = function() {
		console.log($scope.registrationForm.username.$invalid);
		//$state.go('chat');
	};

	$scope.checkUsername = function() {
		if(!$scope.user.username 
		|| $scope.user.username === '') {
			return;
		}
		$scope.showUsernameSpinner = true;
		loginService
		.checkUsername($scope.user.username)
		.success(function(data) {
			$scope.showUsernameSpinner = false;
		})
		.error(function(error) {
			$scope.showUsernameSpinner = false;
		});
	};

	$scope.checkEmail = function() {
		if(!$scope.user.email 
		|| $scope.user.email === '') {
			return;
		}
		$scope.showEmailSpinner = true;
		loginService
		.checkEmail($scope.user.email)
		.success(function(data) {
			$scope.showEmailSpinner = false;
		})
		.error(function(error) {
			$scope.showEmailSpinner = false;
		});
	};

}]);