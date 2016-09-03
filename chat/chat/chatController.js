angular.module('chatModule').controller('chatController', ['$scope', '$http', '$state', 'tokenService',
function($scope, $http, $state, tokenService) {
  $scope.chat = {};
  $scope.messages = [];

  if(!tokenService.checkToken()) {
    $state.go('authentication');
  }

  $scope.logout = function() {
      tokenService.deleteToken();
      $state.go('login');
  };
  
  $scope.showUserModal = function(idx){
    $scope.currUser = $scope.users[idx].user;
    $('#userModal').modal('show');
  };

  $scope.showPaymentModal = function() {
    $('#paymentModal').modal('show');
  };

  
  $scope.sendMessage = function($event) {
    console.log($scope.chat);
    if(($event && $event.keyCode === 13)
      || !$event) {
        var user = {
          text: $scope.chat.message,
          date: new Date()
        };

        $scope.messages.push(user);
    }
  };

  $scope.showLocalProfileModal = function() {
    $('#localProfileModal').modal('show');
  };

}]);