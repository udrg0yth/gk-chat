angular.module('loginModule').controller('loginController',['$scope', '$state', 'loginService',  function($scope, $state, loginService){
		$scope.register = function() {
			$state.go('register');
		};

		$scope.login = function() {
			var data = $scope.user;
			if(!data.username
			|| !data.password) {
				return;
			}

			loginService
			.login(data)
			.then(function(data, status, headers, config) {
				var token = headers()['x-auth-token'];
				if(token != null) {
					loginService.saveToken(token);
					$state.go('chat');
				}
			}, function(error) {
				console.log(error);
			});
		};

}])