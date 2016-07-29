angular.module('loginModule').service('loginService', ['$http', 'loginConstant', '$localStorage', '$base64', 'genericConstant',
 function ( $http, loginConstant, $localStorage, $base64, genericConstant) {
 	return {
 		authenticate: function(user) {
	 		return $http.get(genericConstant.BASE_URL + loginConstant.LOGIN_URL, {
	 			headers: {
	 				Authorization: $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	getHash: function(email) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.GET_HASH_URL, {
	 			email: email
	 		});
	 	},
	 	register: function(user, sendEmail) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.REGISTRATION_URL, 
	 		{sendEmail: sendEmail}, {
	 			headers: {
	 				Authorization: $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	checkHash: function(hash) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.CHECK_HASH_URL, {
	 			hash: hash
	 		});
	 	},
	 	checkUsername: function(username) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.CHECK_USERNAME_URL, {
	 			username: username
	 		});
	 	},
	 	checkEmail: function(email) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.CHECK_EMAIL_URL, {
	 			email: email
	 		});
	 	},
	 	resendEmail: function(email) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.RESEND_EMAIL_URL, {
	 			email: email
	 		});
	 	},
	 	activateAccount: function(hash) {
	 		return $http.post(genericConstant.BASE_URL + loginConstant.ACTIVATE_ACCOUNT_URL, {
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