angular.module('loginModule').service('tokenService', ['$state', '$http', 'loginConstant', '$localStorage', 'jwtHelper',
 function ($state, $http, loginConstant, $localStorage, jwtHelper) {
 	return {
 		checkToken: function() {
	 		if(!$localStorage.token) {
	 			return false;
	 		}
	 		return true;
	 	},
	 	decodeToken: function() {
	 		var user = jwtHelper.decodeToken($localStorage.token);
	 		user.g = user.g === 0?'Male':'Female';
	 		return user;
	 	},
	 	deleteToken: function() {
	 		delete $localStorage.token;
	 	}
 	};
}]);