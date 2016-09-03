angular.module('loginModule').service('tokenService', ['$state', '$http', 'loginConstant', '$localStorage', 
 function ($state, $http, loginConstant, $localStorage) {
 	return {
 		checkToken: function() {
	 		if(!$localStorage.token) {
	 			return false;
	 		}
	 		return true;
	 	},
	 	deleteToken: function() {
	 		delete $localStorage.token;
	 	}
 	};
}]);