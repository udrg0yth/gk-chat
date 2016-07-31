angular.module('loginModule').service('personalityService', ['$http','personalityConstant', 'genericConstant', '$localStorage',
 function ( $http, personalityConstant, genericConstant, $localStorage) {
 	return {
 		getPersonalityQuestionForRegistration: function(hash) {
 			return $http.post(genericConstant.BASE_URL + personalityConstant.NEXT_PERSONALITY_QUESTION_URL, {
 				hash: hash
	 		});
 		},
 		getNextQuestion: function() {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.NEXT_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	},
	 	answerQuestion: function(question) {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.ANSWER_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $localStorage.token
	 			}
	 		});
	 	}
	};
}]);