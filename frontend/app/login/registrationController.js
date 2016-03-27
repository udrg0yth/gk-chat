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
			.success(function(data, status, headers, config) {
				console.log(headers);
				var token = headers()['x-auth-token'];
				if(token != null) {
					loginService.saveToken(token);
					$state.go('chat');
				}
			})
			.error(function(error) {
				console.log(error);
			});
	};
}]);