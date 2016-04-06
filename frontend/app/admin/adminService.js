angular.module('adminModule').factory('adminService', ['$http', 
													   '$localStorage', 
													   'adminConstant', function($http, 
													   					   $localStorage, 
													   					   adminConstant) {

	return {
		'getAllQuestions': function() {
			return $http.get(adminConstant.baseUrl + adminConstant.questionUrl);
		}
	};
}]);