angular.module('loginModule').service('gkService', ['$http','gkConstant', 'genericConstant', '$localStorage',
 function ( $http, gkConstants, genericConstants, $localStorage) {
 	return {
 		getRandomQuestion: function(user) {
	 		return $http.post(genericConstants.BASE_URL + gkConstants.RANDOM_GK_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	},
	 	answerQuestion: function(answer) {
	 		return $http.post(genericConstants.BASE_URL + gkConstants.ANSWER_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	}
	};
}]);