angular.module('loginModule').service('loginService', ['$http', 'loginConstant', '$localStorage', '$base64',
 function ( $http, loginConstant, $localStorage, $base64) {
 	return {
 		authenticate: function(user) {
	 		return $http.get(loginConstant.BASE_URL + loginConstant.LOGIN_URL, {
	 			headers: {
	 				Authorization: $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	register: function(user) {
	 		return $http.post(loginConstant.BASE_URL + loginConstant.REGISTRATION_URL, {}, {
	 			headers: {
	 				Authorization: $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	checkUsername: function(username) {
	 		return $http.post(loginConstant.BASE_URL + loginConstant.CHECK_USERNAME_URL, {
	 			username: username
	 		});

	 	},
	 	checkEmail: function(email) {
	 		return $http.post(loginConstant.BASE_URL + loginConstant.CHECK_EMAIL_URL, {
	 			email: email
	 		});
	 	},
	 	resendEmail: function(email) {
	 		return $http.post(loginConstant.BASE_URL + loginConstant.RESEND_EMAIL_URL, {
	 			email: email
	 		});
	 	},
	 	activateAccount: function(hash) {
	 		return $http.post(loginConstant.BASE_URL + loginConstant.ACTIVATE_ACCOUNT_URL, {
	 			hash: hash
	 		});
	 	},
	 	getErrorMessage: function(error) {

	 	},
	 	isDate: function(val) {
			var d = new Date(val);
			return !isNaN(d.valueOf());
		}
 	};
}]);