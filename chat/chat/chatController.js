angular.module('chatModule').controller('chatController', ['$scope', '$http', '$state', 'tokenService', 'signalingService', '$rootScope',
function($scope, $http, $state, tokenService, signalingService, $rootScope) {
  $scope.chat = {};
  $scope.matched = false;
  $scope.messages = [];

  $scope.showVideo = true;

  var video = document.getElementById('videoElement');
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
  function handleVideo(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
  }
  function videoError(e) {
      document.write("can't use the webcam");
  }

  if(!tokenService.checkToken()) {
    $state.go('authentication');
  } else {
    $scope.localUser = tokenService.decodeToken();
    $scope.signalingServer = signalingService.getSignalingServer($scope.localUser);
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
        $scope.signalingServer.send($scope.chat.message);
        $scope.messages.push(user);
    }
  };

  $scope.signalingServer.onMessage(function(message) {
    var user = {
          text: message,
          date: new Date()
    };
    $scope.messages.push(user);
    $scope.$apply();
  });

  $scope.showLocalProfileModal = function() {
    $('#localProfileModal').modal('show');
  };

  $scope.match = function() {
    $scope.lookingForAMatch = true;
    $scope.signalingServer.createConnection(function(remoteUser) {
      console.log(remoteUser);
        $scope.matched = true;
        $scope.remoteUser = remoteUser;
        $scope.lookingForAMatch = false;
        $scope.$apply();
    });
  };

}]);