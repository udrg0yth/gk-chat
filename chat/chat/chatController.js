angular.module('chatModule').controller('chatController', ['$scope', '$http', '$state', 'tokenService',
function($scope, $http, $state, tokenService) {
  $scope.chat = {};

  $http.get('http://api.randomuser.me/0.4/?results=20').success(function(data) {
    $scope.users = data.results;
    $('#loader').hide();
    $('#userList').show();
    scrollDown();
  }).error(function(data, status) {
    alert('get data error!');
  });

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

  var scrollDown = function (){
    $('#chatBody').animate({scrollTop: $('#chat').height() + $scope.users.length * $('#rightChatMessage').height() + "px"});
  };
  
  $scope.doPost = function($event) {
    if(($event && $event.keyCode === 13)
      || !$event)
    $http.get('http://api.randomuser.me/0.4/').success(function(data) {
      var newUser = data.results[0];
      newUser.user.text = $scope.chat.message;
      delete $scope.chat.message;
      newUser.date = new Date();
      $scope.users.push(newUser);
      scrollDown();
   
    }).error(function(data, status) {
      
      alert('get data error!');
      
    });
    
  }
}]);