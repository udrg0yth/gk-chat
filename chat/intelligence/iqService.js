angular.module('loginModule').service('iqService', ['$http','iqConstant', 'genericConstant', '$localStorage',
 function ( $http, iqConstant, genericConstant, $localStorage) {
 	return {
 		getRandomQuestion: function() {
 			return $http.post(genericConstant.BASE_URL + iqConstant.RANDOM_IQ_QUESTION_URL, {
 				reqtimestamp: Date.now()
 			}, {
 				headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
 		},
	 	answerQuestion: function(answer) {
	 		return $http.post(genericConstant.BASE_URL + iqConstant.ANSWER_IQ_QUESTION__URL, {
 				reqtimestamp: Date.now()
 			}, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	}
	};
}]);