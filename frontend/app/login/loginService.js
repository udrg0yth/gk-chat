angular.module('loginModule').factory('loginService', ['$http', 
													   '$localStorage', 
													   'loginConstant', 
													   '$base64', function($http, 
													   					   $localStorage, 
													   					   loginConstant,
													   					   $base64) {

	return {
		'login': function(data) {
			return $http.get(loginConstant.baseUrl + loginConstant.loginUrl, {
				headers: {
					Authorization : $base64.encode(data.username + ':' + data.password)
				}
			});
		},
		'register': function(data) {
			return $http.post(loginConstant.baseUrl + loginConstant.registrationUrl, data);
		},
		'logout': function() {
			return $http.post(loginConstant.baseUrl + loginConstant.registrationUrl, data);
		},
		'saveToken': function(token) {
			$localStorage.token = token;
			$http.defaults.headers.common['X-Auth-Token'] =  token;
		},
		'setTokenHeader': function(token) {
			$http.defaults.headers.common['X-Auth-Token'] =  token;
		},
		'clearStorage': function() {
			delete $localStorage.token;
			delete $http.defaults.headers.common['X-Auth-Token'];
		}

	};
}]);