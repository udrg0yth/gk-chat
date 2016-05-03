angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage',
function($scope, $state, loginService, tokenService, $localStorage) {
	$scope.user = {
		gender: 'male'
	};
	$scope.errorMessage = '';
	$scope.passwordsMatch = true;
	$scope.submittedRegistration = false;
	$scope.submittedLogin = false;
	$scope.showErrorMessage = false;
	$scope.showUsernameSpinner = false;
	$scope.showEmailSpinner = false;

	$('.date-pick input').datepicker({
		format : 'yyyy-mm-dd',
		startView: "years",
		autoclose : true
	});

	if(tokenService.checkToken()) {
		//$state.go('chat');
	}

	$scope.login = function() {
		$scope.submittedLogin = true;
		$scope.showErrorMessage = false;
		if($scope.loginForm.$invalid) {
			return;
		}
		$scope.submittedLogin = false;
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
		$scope.submittedRegistration = true;
		if($scope.registrationForm.$invalid) {
			return;
		}
		if($scope.user.password 
		!== $scope.user.repeatedPassword) {
			$scope.passwordsMatch = false;
			return;
		} else {
			$scope.passwordsMatch = true;
		}
		$scope.submittedRegistration = false;
		console.log($scope.registrationForm.username.$invalid);
		//$state.go('chat');
	};

	$scope.checkUsername = function() {
		if($scope.registrationForm.username.$invalid) {
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