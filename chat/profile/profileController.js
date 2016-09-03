angular.module('loginModule').controller('profileController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage', '$stateParams', 
	'$rootScope', 'WizardHandler', '$timeout', '$interval',
function($scope, $state, loginService, tokenService, $localStorage, $stateParams, $rootScope, WizardHandler, $timeout, $interval) {

  if($stateParams.userHash) { 
	 loginService
	.checkHash($stateParams.userHash)
	.success(function() {
		if($localStorage.profileQuestions) {
			$scope.personalityQuestion = $localStorage.profileQuestions.personalityQuestion;
			$scope.iqQuestion = $localStorage.profileQuestions.iqQuestion;
			$scope.gkQuestion = $localStorage.profileQuestions.gkQuestion;
		} else {
			loginService
			.getProfileQuestions($stateParams.userHash)
			.success(function(data) {
				$localStorage.profileQuestions = data;
				$scope.personalityQuestion = data.personalityQuestion;
				$scope.iqQuestion = data.iqQuestion;
				$scope.gkQuestion = data.gkQuestion;
			});
		}
	})
	.error(function(err) {
		$state.go('authentication');
	});
  } else {
	$state.go('authentication');
  }

  $scope.user = {
	gender: 0,
	username: '',
	birthdate: ''
  };

  $scope.datepicker = {
  	opened: false,
  	options: {
  		datepickerMode: 'year',
  		formatYear: 'yyyy',
  		formatMonth: 'MM',
  		formatDay: 'dd'
  	}
  };

  $scope.iqQuestion = {};
  $scope.gkQuestion = { answer:''};
  $scope.personalityQuestion = {};

  $scope.firstPersonalityPage = true;
  $scope.iqTimer = null;
  $scope.current = 0;
  $scope.max = 0;
  $scope.labels = ['Introversion', 'iNtuition', 'Thinking', 'Perceiving'];
  $scope.data = [0.1, 0.1, 0.1, 0.1];
  $scope.globalLabels = ['INTP', 'ENTP', 'INTJ', 'ESTJ', 'ENFP', 'ISTJ'];
  $scope.globalData = [300, 500, 100, 200, 400, 350];
  $scope.slider = {
	  value: 'Neutral',
	  options: {
	  	steps: 10,
	    floor: -20,
	    ceil: 20,
	    stepsArray: [
				  {value: 'Strongly agree', legend: 'Legend for 10'}, 
				  {value: 'Agree', legend: 'Legend for 10'},
				  {value: 'Neutral', legend: 'Legend for 10'},
				  {value: 'Disagree', legend: 'Legend for 10'},
				  {value: 'Strongly disagree', legend: 'Legend for 10'}
				],
	    showSelectionBarFromValue: 'Neutral',
	    getSelectionBarColor: function(value) {
	    		console.log(value);
	          switch(value) {
	          		case 'Strongly agree': return 'red';
	          		case 'Agree': 
	          		case 'Disagree': return 'yellow';
	          		case  'Strongly disagree' : return 'red';
	          }
	    }
	  }
  };

  var drawGauss = function(mean, deviation, cv) {
  			var a = 100,
				ctx = cv.getContext("2d");

			ctx.clearRect(0, 0, cv.width, cv.height);
			ctx.font = "10px Arial";
			
			for (var j=0; j< 150; j++){
				var y = a/Math.pow(Math.E, (Math.pow(j-mean, 2))/(2*deviation*deviation));

				if(j<30){
					ctx.fillStyle = "red";
				} else {
					ctx.fillStyle = "white";
				}
				ctx.beginPath();
				ctx.rect(j*10, cv.height/2-y, 10, y);
				ctx.closePath();
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "black";
				ctx.stroke();
			}
			ctx.fillStyle = "black";
			for(var j=62.5;j<500;j+=62.5) {
				ctx.moveTo(j,cv.height/2);
				ctx.arc(j,cv.height/2, 2, 0, 2 * Math.PI, false);
				ctx.fillText((j/62.5)*25,j,cv.height/2+20);
			}
			ctx.moveTo(300,0);
			ctx.lineTo(300,cv.height/2+50);
			
			ctx.moveTo(310,50);
			ctx.font = "15px Arial";
			ctx.fillText("You: 120", 310,50);
		    ctx.stroke();
  }, getValueFromLabel = function(label)  {
  		switch(label) {
	      		case 'Strongly agree': return '0';
	      		case 'Agree': return '1';
	      		case 'Neutral': return '2'
	      		case 'Disagree': return '3';
	      		case  'Strongly disagree' : return '4';
	    }
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.datepicker.opened = true;
  };

  $scope.getStyle = function(){
        var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
        return {
        	'height': '10% !important',
            'top': $scope.isSemi ? 'auto' : '50%',
            'bottom': $scope.isSemi ? '5%' : 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform
        };
    };

  $scope.setBasicProfileInfo = function(registrationForm) {
  		$scope.user.birthdate = moment($scope.user.birthdate).format('YYYY-MM-DD');
		$scope.showInvalidDate = false;
		$scope.showInvalidUsername = false;

		if(registrationForm.username.$invalid) {
			$scope.invalidUsername = 'Username must have between 3 and 15 alphanumeric characaters!'
			$scope.showInvalidUsername = true;
			return;
		} 

		if(!(moment($scope.user.birthdate, 'YYYY-MM-DD', true).isValid())) {
			$scope.invalidDate = 'Invalid date format! Expecting yyyy-MM-dd.';
			$scope.showInvalidDate = true;
			return;
		} 

		loginService
		.checkUsername($scope.user.username)
		.success(function(data) {
			WizardHandler.wizard().next();
		})
		.error(function(error) {
			$scope.invalidUsername = 'Username in use! Please choose another.'
			$scope.showInvalidUsername = true;
		});
	};

	$scope.showPersonalityQuestionModal = function() {
			$('#personalityQuestionModal').modal('show');
			/*$timeout(function(){
		        $scope.$broadcast('reCalcViewDimensions');
		    }, 500);*/
	};

	$scope.showIQQuestionModal = function() {
			/*$scope.current = 0;
			$scope.max = parseInt(data.timeLeft);*/
			
			drawGauss(25, 10, document.getElementById('c'));

			$('#iqQuestionModal').modal('show');
			/*if($scope.iqTimer) {
				$interval.cancel($scope.iqTimer);
			}
			 $scope.iqTimer = 
			$interval(function(){
				$scope.current++;
			},1000);*/
	};

	$scope.showGKQuestionModal = function() {
			$('#gkQuestionModal').modal('show');
	};

	$scope.setPersonalityAnswer = function() {
		$scope.personalityQuestion.answer = getValueFromLabel($scope.slider.value);
		$('#personalityQuestionModal').modal('hide');
		WizardHandler.wizard().next();
	};

	$scope.setIQAnswer = function(answerId) {
		/*if($scope.iqTimer) {
			$interval.cancel($scope.iqTimer);
		}*/
		$('#iqQuestionModal').modal('hide');
		$scope.iqQuestion.answerId = answerId;
		WizardHandler.wizard().next();
	};

	$scope.setGkAnswer = function() {
		if($scope.gkQuestion.answer != null &&
		   $scope.iqQuestion.answerId != null &&
		   $scope.personalityQuestion.answer != null) {
		   	loginService
		   .setProfile({
		   		hash: $stateParams.userHash,
		   		basicInfo: {
		   			username: $scope.user.username,
   					gender: $scope.user.gender,
   					birthdate: $scope.user.birthdate
		   		},
		   		personalityAnswer: {
		   			answer: $scope.personalityQuestion.answer,
		   			negativelyAffectedType: $scope.personalityQuestion.negativelyAffectedType
		   		},
		   		iqAnswer: {
		   			answer: $scope.iqQuestion.answerId,
		   			questionId: $scope.iqQuestion.questionId
		   		},
		   		gkAnswer: {
		   			answer: $scope.gkQuestion.answer,
		   			questionId: $scope.gkQuestion.questionId
		   		}
		   })
		   .success(function() {
		   		$state.go('chat');
		   })
		   .error(function(err) {
		   });
		}
	};
}]); 