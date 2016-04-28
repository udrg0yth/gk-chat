angular.module('loginModule').service('loginService', ['$state', '$http', 'loginConstant', '$localStorage', 
 function ($state, $http, loginConstant, $localStorage) {
 	$scope.checkToken() {
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
 	};
}]);