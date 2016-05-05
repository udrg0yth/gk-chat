angular.module('loginModule').service('tokenService', ['$state', '$http', 'loginConstant', '$localStorage', 
 function ($state, $http, loginConstant, $localStorage) {
 	return {
 		checkToken: function() {
	 		if(!$localStorage.token) {
	 			return false;
	 		}
	 		$http.post(loginConstant.authBaseUrl + loginConstant.verifyTokenUrl, {
	 			token: $localStorage.token
	 		})
	 		.success(function(){
	 			return true;
	 		})
	 		.error(function() {
	 			return false;
	 		});
	 		return false;
	 	},
	 	deleteToken: function() {
	 		delete $localStorage.token;
	 	}
 	};
}]);