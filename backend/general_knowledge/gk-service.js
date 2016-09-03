module.exports = function(application, gkConstants, genericConstants, gkMysqlHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeTimedOutQuestions = function() {
		 gkMysqlHandler
		.updateUserScoreGlobal()
		.then(function() {
			gkMysqlHandler
		   .removeTimedOutQuestions()
		   .catch(function(error) {
		   		console.log('Error while cleaning gk_question_user from timed out questions!', error.message);
		   });
		})
		.catch(function(error) {
	   		console.log('Error while updating score for timed out questions!', error.message);
	   });
	}, count = function () {
		 gkMysqlHandler
		.countQuestions()
		.then(function(rows) {
		  	questionCount = rows[0].questionCount;
		 })
		.catch(function(error) {
		  	console.log('Error while counting gk questions!', error.message);
		 });
	}, getGKExchangeModel = function(timeLeft, rows) {
		return {
    		timeLeft: timeLeft,
			questionId: rows[0].gk_question_id,
			question: rows[0].gk_question,
			answers: genericConstants.SHUFFLE_ARRAY(
				[rows[0].gk_answer1,
				rows[0].gk_answer2,
				rows[0].gk_answer3,
				rows[0].gk_answer4])
		};
	}, sendNewQuestion = function(userId, res) {
		var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
		 gkMysqlHandler
		.getQuestionById(random)
		.then(function(rows) {
			 gkMysqlHandler
		    .setTimeout(userId, rows[0].iq_question_id)
		    .then(function() {
		    	res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(claims)});
				res.end(JSON.stringify(getIqExchangeModel(genericConstants.GET_VALUES.GK_TIME_LIMIT, rows)));
		    })
		    .catch(function(error) {
		    	res.status(genericConstants.INTERNAL_ERROR).json({
					message: error.message,
					trace: 'IQ-SCE-GRQ'
				});
		    });
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: 'IQ-SCE-GRQ'
			});
		});
	}, updateScore = function(forProfile, answer, claims, correct, trace, res) {
		 gkMysqlHandler
		.updateUserScore(claims, correct)
		.then(function() {
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, updateRemainingGKQuestions = function() {
		 gkMysqlHandler
		.updateRemainingGKQuestions()
		.catch(function(error) {
			console.log('Error while updating global remaining IQ questions', error.message);
		});
	};

	if(!questionCount) {
		count();
	}
	removeTimedOutQuestions();

	//update remaining questions every day for everyone
	schedule.scheduleJob('* 10 * * *', function(){
		updateRemainingGKQuestions();
	});

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  count();
	});

	schedule.scheduleJob('10 * * * *', function(){
		  removeTimedOutQuestions();
	});


	return {
		getRandomQuestionForProfile: function(res) {
			 var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
			 return gkMysqlHandler
			.getQuestionById(random)
			.then(function(rows) {
				return res.status(genericConstants.OK).json(getGKExchangeModel(null, rows));
			});
		},
		answerQuestionForProfile: function(userId, question, res) {
			return gkMysqlHandler
			.getQuestionById(question.questionId)
			.then(function(rows) {
				 if(question.answerId === rows[0].answer4) {
					updateScore(true, true, userId, true, 'GK-SCE-AQPRF', res);
				} else {
					updateScore(true, true, userId, false, 'GK-SCE-AQPRF', res);
				}
			});
		},
		getRandomQuestion: function(userId, requestTime, res) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 &&
				parseInt(rows[0].diftime) < (genericConstants.GET_VALUES.GK_TIME_LIMIT  + 2*requestTime)) {
							res.status(genericConstants.OK).json(
								getIqExchangeModel(genericConstants.GET_VALUES.GK_TIME_LIMIT -(rows[0].diftime + requestTime), rows));
				} else {
					if(rows.length > 0) {
						updateScore(false, false, userId, false, 'GK-SCE-GRQ', res);
					} else {
						sendNewQuestion(userId, res);
					}
					
				}
			});
		},
		answerQuestion: function(claims, requestTime, question, res) {
			return iqMysqlHandler
			.getQuestionForUser(claims.ky)
			.then(function(rows) {
				if(rows.length>0 &&
				parseInt(rows[0].diftime) > (genericConstants.GET_VALUES.GK_TIME_LIMIT +
				2*requestTime)) {
					  if(question.answerId === rows[0].correctAnswerId) {
							updateScore(false, true, claims, true, 'IQ-SRV-AQ', res);
					} else {
						    updateScore(false, true, claims, false, 'IQ-SRV-AQ', res);
					}
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						message: gkConstants.GK_TIMEOUT.message
					});
				}
			});
		}
		
	};
};