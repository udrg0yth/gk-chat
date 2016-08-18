angular.module('loginModule').service('gkService', ['$http','gkConstant', 'genericConstant', '$localStorage',
 function ( $http, personalityConstant, genericConstant, $localStorage) {
 	return {
 		getRandomQuestionForProfile: function(hash) {
 			return $http.get(genericConstant.BASE_URL + gkConstant.RANDOM_GK_QUESTION_FOR_PROFILE_URL);
 		},
 		answerQuestionForProfile: function(question) {
 			return $http.post(genericConstant.BASE_URL + gkConstant.ANSWER_QUESTION_FOR_PROFILE_URL, question);
 		},
 		getRandomQuestion: function(user) {
	 		return $http.post(genericConstant.BASE_URL + gkConstant.RANDOM_GK_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	},
	 	answerQuestion: function(question) {
	 		return $http.post(genericConstant.BASE_URL + gkConstant.ANSWER_QUESTION_URL, {
	 			headers: {
	 				'X-Auth-Token': $base64.encode(user.email + ':' + user.password)
	 			}
	 		});
	 	}
	};
}]);