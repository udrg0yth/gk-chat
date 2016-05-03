angular.module('loginModule').service('tokenService', ['$state', '$http', 'loginConstant', '$localStorage', 
 function ($state, $http, loginConstant, $localStorage) {
 	return {
 		checkToken: function() {
	 		if(!$localStorage.token) {
	 			return false;
	 		}
	 		$http.get(loginConstant.authBaseUrl + loginConstant.verifyTokenUrl, {
	 			token: $localStorage.token
	 		})
	 		.error(function() {
	 			return false;
	 		});
	 		return true;
	 	}
 	};
}]);