angular.module('loginModule').factory('facebookService', [ 'loginService', '$state', '$localStorage', function(loginService, $state, $localStorage) {

    var activateAccount = function(hash) {
         loginService
        .activateAccount(hash)
        .success(function() {
            $state.go('completeProfile', {userHash:hash});
            delete $localStorage.hash;
        })
        .error(function(err) {
        });
    };
    return {
        loginOrRegisterFacebook: function() {
            FB.login(function(response){
              if(response.authResponse)
              {
                  FB.api('/me?fields=email', function(responseFromFB){      
                        var user = {
                            email: responseFromFB.email,
                            password: responseFromFB.id
                        };                                                     
                         loginService
                        .authenticate(user)
                        .success(function(data, status, headers) {
                            var head = headers();
                            if(head['x-auth-token']) {
                              $localStorage.token = head['x-auth-token'];
                              $state.go('chat');
                            }
                        })
                        .error(function(err) {
                           if(err.message === 'BAD_CREDENTIALS') {
                                   loginService
                                  .register(user, false)
                                  .success(function(data) {
                                        $localStorage.hash = data.hash;
                                        activateAccount(hash);
                                  });
                           } else if(err.message === 'INCOMPLETE_PROFILE') {
                                   loginService
                                  .getHash(user.email)
                                  .success(function(data) {
                                      $state.go('completeProfile', {userHash: data.hash});
                                  })
                                  .error(function(err) {
                                      console.log(err);
                                  });
                           } else if(err.message === 'INACTIVE_ACCOUNT') {
                              if($localStorage.hash) {
                                 activateAccount($localStorage.hash);
                              } else {
                                  loginService
                                 .getHash(user.email)
                                 .success(function(data) {
                                    activateAccount(data.hash);
                                 });
                              }
                           }
                        });
                  });
              }
              else
              {
                  console.log('The login failed because they were already logged in');
              }
            }, {scope:'email'});
        }
    }
}]);