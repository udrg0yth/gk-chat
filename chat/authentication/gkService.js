angular.module('loginModule').service('gkService', ['$http','personalityConstant', 'genericConstant',
 function ( $http, personalityConstant, genericConstant) {
 	return {
 		getPersonalityQuestionForRegistration: function(hash) {
 			return $http.post(genericConstant.BASE_URL + personalityConstant.NEXT_PERSONALITY_QUESTION_URL, {
 				hash: hash
	 		});
 		},
 		getNextQuestion: function(user) {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.NEXT_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	answerQuestion: function(question) {
	 		return $http.post(genericConstant.BASE_URL + personalityConstant.ANSWER_PERSONALITY_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	}
	};
}]);