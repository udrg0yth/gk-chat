angular.module('chatModule').controller('chatController', ['$scope', '$http',
function($scope, $http) {

  $http.get('http://api.randomuser.me/0.4/?results=20').success(function(data) {
    $scope.users = data.results;
    $('#loader').hide();
    $('#userList').show();
    console.log($scope.users);
  }).error(function(data, status) {
    alert('get data error!');
  });
  
  $scope.showUserModal = function(idx){
    var user = $scope.users[idx].user;
    $scope.currUser = user;
    $('#myModalLabel').text(user.name.first
         + ' ' + user.name.last);
    $('#myModal').modal('show');
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