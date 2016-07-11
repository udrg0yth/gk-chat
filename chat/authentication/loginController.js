angular.module('loginModule').controller('loginController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage', '$stateParams', '$rootScope', 'WizardHandler',
function($scope, $state, loginService, tokenService, $localStorage, $stateParams, $rootScope, WizardHandler) {
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

	

	if($stateParams.userHash) {
		loginService
		.activateAccount($stateParams.userHash)
		.success(function() {
		})
		.error(function(error) {
			// $state.go('login');
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

	$scope.resendEmail= function() {
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

	$scope.firstStep = function() {
		$scope.showInvalidDate = false;
		if(!(moment($scope.user.birthdate, "YYYY-MM-DD", true).isValid())) {
			$scope.errorMessage = 'Invalid date format! Expecting yyyy-MM-dd.';
			$scope.showInvalidDate = true;
			return;
		} else {
			WizardHandler.wizard().next();
		}
	};

	$scope.checkUsername = function(registrationForm) {
		$scope.showErrorMessage = false;
		if(registrationForm.username.$invalid) {
			$scope.errorMessage = 'Username must have between 3 and 15 alphanumeric characaters!'
			$scope.showErrorMessage = true;
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
			$scope.errorMessage = 'Username in use! Please choose another.'
			$scope.showErrorMessage = true;
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

	$scope.showPersonalityQuestionModal = function() {
		$('#personalityQuestionModal').modal('show');
	};
}]);