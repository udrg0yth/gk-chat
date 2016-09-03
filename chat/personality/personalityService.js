angular.module('loginModule').service('personalityService', ['$http','personalityConstant', 'genericConstant', '$localStorage',
 function ( $http, personalityConstant, genericConstant, $localStorage) {
 	return {
 		getNextQuestion: function() {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.NEXT_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	},
	 	answerQuestion: function(answer) {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.ANSWER_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		},answer);
	 	}
	};
}]);