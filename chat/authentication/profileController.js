angular.module('loginModule').controller('profileController', ['$scope', '$state', 'loginService', 'tokenService', '$localStorage', '$stateParams', 
	'$rootScope', 'WizardHandler', '$timeout', 'personalityService', 'iqService', 'gkService', '$interval',
function($scope, $state, loginService, tokenService, $localStorage, $stateParams, $rootScope, WizardHandler, $timeout, personalityService, iqService, gkService, $interval) {
	console.log($stateParams.userHash);
	if($stateParams.userHash) { 
		loginService
		.checkHash($stateParams.userHash)
		.error(function(err) {
			$state.go('authentication');
		});
	} else {
		$state.go('authentication');
	}

	$scope.user = {
		gender: 'male'
	};
$scope.datepicker = {
  	opened: false,
  	options: {
  		datepickerMode: 'year'
  	}
  };

  $scope.open = function($event) {
  	console.log('open');
    $event.preventDefault();
    $event.stopPropagation();

    $scope.datepicker.opened = true;
  };

  $scope.iqTimer = null;
  $scope.current = 0;
  $scope.max = 0;

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


  $scope.formats = ['yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[2];




	$scope.firstPersonalityPage = true;

  $scope.labels = ['Introversion', 'iNtuition', 'Thinking', 'Perceiving'];
  $scope.data = [0.1, 0.1, 0.1, 0.1];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

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

  $scope.getValueFromLabel = function(label)  {
  		switch(label) {
	      		case 'Strongly agree': return 0;
	      		case 'Agree': return 1;
	      		case 'Neutral': return 2
	      		case 'Disagree': return 3;
	      		case  'Strongly disagree' : return 4;
	    }
  };

  $scope.firstStep = function() {
		$scope.showInvalidDate = false;
		if(!(moment($scope.user.birthdate, 'YYYY-MM-DD', true).isValid())) {
			$scope.errorMessage = 'Invalid date format! Expecting yyyy-MM-dd.';
			$scope.showInvalidDate = true;
			return;
		} else {
			WizardHandler.wizard().next();
		}
	};

	$scope.checkUsername = function(registrationForm) {
		$scope.showErrorMessage = false;
		if(registrationForm.username.$invalid) {
			$scope.errorMessage = 'Username must have between 3 and 15 alphanumeric characaters!'
			$scope.showErrorMessage = true;
			return;
		} 

		if($scope.usernameAlreadyCheckedPositive) {
			return;
		}
		$scope.showUsernameSpinner = true;
		loginService
		.checkUsername($scope.user.username)
		.success(function(data) {
			$scope.showUsernameSpinner = false;
			$scope.usernameAlreadyCheckedPositive = true;
		})
		.error(function(error) {
			$scope.errorMessage = 'Username in use! Please choose another.'
			$scope.showErrorMessage = true;
			$scope.showUsernameSpinner = false;
		});
	};

	$scope.onUsernameInputChange = function() {
		$scope.usernameAlreadyCheckedPositive = false;
	};

	$scope.showPersonalityQuestionModal = function() {
		personalityService
		.getPersonalityQuestionForRegistration($stateParams.userHash)
		.success(function(data) {
			$scope.personalityQuestion = data;
			$('#personalityQuestionModal').modal('show');
			$timeout(function(){
		        $scope.$broadcast('reCalcViewDimensions');
		    }, 500);
		})
		.error(function(error) {
			console.log(error);
		});
	};

	$scope.showIQQuestionModal = function() {
		 iqService
		.getRandomQuestionForProfile($stateParams.userHash)
		.success(function(data) {
			$scope.iqQuestion = data;
			$scope.current = 0;
			$scope.max = parseInt(data.timeLeft);

			var a = 100;
			var b = 25;
			var c = 10;

			var cv = document.getElementById('c');
			var ctx = cv.getContext("2d");
			ctx.clearRect(0, 0, cv.width, cv.height);
			ctx.font = "10px Arial";
			
			for (var j=0; j< 150; j++){
				var y = a/Math.pow(Math.E, (Math.pow(j-b, 2))/(2*c*c));

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


			$('#iqQuestionModal').modal('show');
			if($scope.iqTimer) {
				$interval.cancel($scope.iqTimer);
			}
			 $scope.iqTimer = 
			$interval(function(){
				$scope.current++;
			},1000);
		})
		.error(function(error) {
			console.log(error);
		});
	};

	$scope.showGKQuestionModal = function() {
		 iqService
		.getRandomQuestion()
		.success(function(data) {
			$scope.gkQuestion = data;
			$('#gkQuestionModal').modal('show');
		})
		.error(function(error) {
			console.log(error);
		});
	};

	$scope.setPersonalityAnswer = function() {
		$scope.personalityQuestion.answer = ($scope.getValueFromLabel($scope.slider.value)+20)/10;
		$('#personalityQuestionModal').modal('hide');
		WizardHandler.wizard().next();
	};

	$scope.setIQAnswer = function(answerId) {
		if($scope.iqTimer) {
			$interval.cancel($scope.iqTimer);
		}
		$('#iqQuestionModal').modal('hide');
		$scope.iqQuestion.answerId = answerId;
		WizardHandler.wizard().next();
	};

	$scope.setGKAnswer = function() {
		WizardHandler.wizard().next();
	};
}]); 