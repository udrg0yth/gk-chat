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
	$scope.invalidDate = false;
	$scope.usernameAlreadyCheckedPositive = false;
	$scope.emailAlreadyCheckedPositive = false;

	$('#datepick input').datepicker({
		format : 'yyyy-mm-dd',
		startView: "years",
		autoclose : true
	});

	$scope.login = function() {
		$scope.submittedLogin = true;
		$scope.showErrorMessage = false;
		if($scope.loginForm.$invalid) {
			return;
		}
		$scope.submittedLogin = false;
		loginService.authenticate($scope.user)
		.success(function(data, status, headers) {
			var head = headers();
			if(head['x-auth-token']) {
				$localStorage.token = head['x-auth-token'];
				$state.go('chat');
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
		$scope.errorMessage = false;
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
		loginService.register($scope.user)
		.success(function(data, status, headers) {
			var head = headers();
			if(head['x-auth-token']) {
				$localStorage.token = head['x-auth-token'];
			}
		})
		.error(function(err) {
			$scope.errorMessage = 'Could not create account. Try again.';
			$scope.showErrorMessage = true;
		});
	};

	$scope.checkUsername = function() {
		if($scope.registrationForm.username.$invalid) {
			return;
		}
		if($scope.usernameAlreadyCheckedPositive) {
			return;
		}
		$scope.showUsernameSpinner = true;
		loginService
		.checkUsername($scope.user.username)
		.success(function(data) {
			$scope.showUsernameSpinner = false;
			$scope.usernameAlreadyCheckedPositive = true;
		})
		.error(function(error) {
			$scope.showUsernameSpinner = false;
		});
	};

	$scope.onUsernameInputChange = function() {
		$scope.usernameAlreadyCheckedPositive = false;
	};

	$scope.checkEmail = function() {
		if(!$scope.user.email 
		|| $scope.user.email === '') {
			return;
		}
		if($scope.emailAlreadyCheckedPositive) {
			return;
		}
		$scope.showEmailSpinner = true;
		loginService
		.checkEmail($scope.user.email)
		.success(function(data) {
			$scope.showEmailSpinner = false;
			$scope.emailAlreadyCheckedPositive = true;
		})
		.error(function(error) {
			$scope.showEmailSpinner = false;
		});
	};

	$scope.onEmailInputChange = function() {
		$scope.emailAlreadyCheckedPositive = false;
	};

}]);