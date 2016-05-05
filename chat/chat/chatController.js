angular.module('chatModule').controller('chatController', ['$scope', '$http', '$state', 'tokenService',
function($scope, $http, $state, tokenService) {

  $http.get('http://api.randomuser.me/0.4/?results=20').success(function(data) {
    $scope.users = data.results;
    $('#loader').hide();
    $('#userList').show();
    console.log($scope.users);
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
  
  $scope.doPost = function() {
  
    $http.get('http://api.randomuser.me/0.4/').success(function(data) {
      
      var newUser = data.results[0];
      newUser.user.text = $('#inputText').val();
      newUser.date = new Date();
      $scope.users.push(newUser);
   
    }).error(function(data, status) {
      
      alert('get data error!');
      
    });
    
  }
}]);