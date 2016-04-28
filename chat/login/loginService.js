angular.module('loginModule').service('loginService', ['$http', 'loginConstant', '$localStorage', 'base64',
 function ($http, loginConstant, $localStorage, base64) {
 	$scope.authenticate = function(user) {
 		return $http.get(loginConstant.authBaseUrl + loginConstant.loginUrl, {
 			headers: {
 				Authentication: base64.encode(user.username + ':' + user.password)
 			}
 		}).success(function(data) {
 			if(data.token) {
 				$localStorage.token = data.token;
 			}

 		}).error(function(error) {

 		});
 	};
}]);