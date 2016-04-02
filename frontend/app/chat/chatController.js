angular.module('chatModule').controller('chatController',['$scope', '$state', 'signalingService', function($scope, $state, signalingService){

	signalingService.createConnection(function(remoteUser) {
			console.log(remoteUser);
	});

}])