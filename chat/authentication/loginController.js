angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage', '$stateParams', '$rootScope',
function($scope, $state, loginService, tokenService, $localStorage, $stateParams, $rootScope) {
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
	$scope.showEmailUsed = false;
	$scope.showPasswordMismatch = false;
	$scope.showResendMail = false;

	$('#datepick input').datepicker({
		format : 'yyyy-mm-dd',
		startView: "years",
		autoclose : true
	});

	if($stateParams.userHash) {
		loginService
		.activateAccount($stateParams.userHash)
		.success(function() {
		})
		.error(function(error) {
			$state.go('login');
		});
	}

	$scope.login = function() {
		$scope.submittedLogin = true;
		$scope.showErrorMessage = false;
		$scope.showResendMail = false;
		if($scope.loginForm.$invalid) {
			return;
		}
		$scope.submittedLogin = false;
		loginService
		.authenticate($scope.user)
		.success(function(data, status, headers) {
			var head = headers();
			if(head['x-auth-token']) {
				console.log(head['x-auth-token']);
				$localStorage.token = head['x-auth-token'];
				//$state.go('chat');
			}
 		}).error(function(e) {
 			if(e.error === 'INCOMPLETE_PROFILE') {
 				$state.go('completeProfile');
 			} else if (e.error === 'INACTIVE_ACCOUNT') {
 				$scope.errorMessage = 'Inactive account! Please confirm your account by clicking on the link inside the sent mail!';
 				$scope.showResendMail = true;
 				$scope.showErrorMessage = true;
 			} else {
 				$scope.errorMessage = 'Wrong username or password!';
 				$scope.showErrorMessage = true;
 			}
 		});
	};

	$scope.resendEmail() {
		loginService
		.resendEmail($scope.user.email)
		.success(function(data) {

		})
		.error(function(error) {

		});
	};

	$scope.goRegister = function() {
		$scope.showErrorMessage = false;
		$state.go('registration');
	};

	$scope.register = function() {
		$scope.errorMessage = false;
		$scope.submittedRegistration = true;
		$scope.showPasswordMismatch = false;
		if($scope.registrationForm.$invalid) {
			return;
		}
		if(!$scope.emailAlreadyCheckedPositive) {
			return;
		}
		if($scope.user.password 
		!== $scope.user.repeatedPassword) {
			$scope.showPasswordMismatch = true;
			$scope.passwordsMatch = false;
			return;
		} else {
			$scope.passwordsMatch = true;
		}

		$scope.submittedRegistration = false;
		loginService.register($scope.user)
		.success(function(data) {
			$rootScope.email = $scope.user.email;
			$state.go('mailSent');
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
		$scope.showEmailUsed = false;
		$scope.showEmailSpinner = true;
		loginService
		.checkEmail($scope.user.email)
		.success(function(data) {
			$scope.showEmailSpinner = false;
			$scope.emailAlreadyCheckedPositive = true;
		})
		.error(function(error) {
			$scope.showEmailSpinner = false;
			$scope.showEmailUsed = true;
		});
	};

	$scope.onEmailInputChange = function() {
		$scope.emailAlreadyCheckedPositive = false;
	};

	$scope.showTutorialModal = function() {
		$('#tutorialProfileModal').modal('show');
	}
}]);