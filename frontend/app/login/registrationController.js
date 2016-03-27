angular.module('loginModule').controller('registrationController',['$scope', '$state', 'loginService', function($scope, $state, loginService) {
	$scope.register = function() {
		var data = $scope.user;
			if(!data.username
			|| !data.password
			|| !data.email) {
				return;
			}

			loginService
			.register(data)
			.then(function(data, status, headers, config) {
				var token = headers()['x-auth-token'];
				if(token != null) {
					loginService.saveToken(token);
					$state.go('chat');
				}
			},function(error) {
				console.log(error);
			});
	};
}]);