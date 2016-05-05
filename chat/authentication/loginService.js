angular.module('loginModule').service('loginService', ['$http', 'loginConstant', '$localStorage', '$base64',
 function ( $http, loginConstant, $localStorage, $base64) {
 	return {
 		authenticate: function(user) {
	 		return $http.get(loginConstant.authBaseUrl + loginConstant.loginUrl, {
	 			headers: {
	 				Authorization: $base64.encode(user.username + ':' + user.password)
	 			}
	 		});
	 	},
	 	register: function(user) {
	 		return $http.post(loginConstant.authBaseUrl + loginConstant.registrationUrl, user);
	 	},
	 	checkUsername: function(username) {
	 		return $http.post(loginConstant.authBaseUrl + loginConstant.checkUsernameUrl, {
	 			username: username
	 		});

	 	},
	 	checkEmail: function(email) {
	 		return $http.post(loginConstant.authBaseUrl + loginConstant.checkEmailUrl, {
	 			email: email
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