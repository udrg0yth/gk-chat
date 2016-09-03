module.exports = function(application, iqConstants, genericConstants, iqMysqlHandler, tokenHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeAllDifficultiesTimedOutQuestions = function() {
		 iqMysqlHandler
		.updateUserScoreGlobalEasy()
		.then(function() {
			iqMysqlHandler
		   .removeTimedOutQuestionsEasy()
		   .catch(function(error) {
		   		console.log('Error while cleaning iq_question_user from easy timed out questions!', error.message);
		   });
		})
		.catch(function(error) {
	   		console.log('Error while updating score for easy timed out questions!', error.message);
	    });
		iqMysqlHandler
		.updateUserScoreGlobalMedium()
		.then(function() {
			iqMysqlHandler
		   .removeTimedOutQuestionsMedium()
		   .catch(function(error) {
		   		console.log('Error while cleaning iq_question_user from medium timed out questions!', error.message);
		   });
		})
		.catch(function(error) {
	   		console.log('Error while updating score for medium timed out questions!', error.message);
	    });
  		iqMysqlHandler
		.updateUserScoreGlobalHard()
		.then(function() {
			iqMysqlHandler
		   .removeTimedOutQuestionsHard()
		   .catch(function(error) {
		   		console.log('Error while cleaning iq_question_user from hard timed out questions!', error.message);
		   });
		})
		.catch(function(error) {
	   		console.log('Error while updating score for hard timed out questions!', error.message);
	    });
	},  count = function() {
		 iqMysqlHandler
		.countQuestions()
		.then(function(rows) {
		  	questionCount = rows[0].questionCount;
		})
		.catch(function(error) {
		  	console.log('Error while counting iq questions!', error.message);
		});
	}, getIqExchangeModel = function(timeLimit, rows) {
		console.log(rows[0]);
		return {
			timeLeft: timeLimit,
			questionId: rows[0].iq_question_id,
			question: rows[0].question,
			answers: genericConstants.SHUFFLE_ARRAY(
			[{ 
				id: rows[0].iq_answer1Id,
				link: rows[0].answer1
			}, {
					id: rows[0].iq_answer2Id,
					link: rows[0].answer2
			}, {
					id: rows[0].iq_answer3Id,
					link: rows[0].answer3
			}, {
					id: rows[0].iq_answer4Id,
					link: rows[0].answer4
			}, {
					id: rows[0].iq_answer5Id,
					link: rows[0].answer5
			}, {
					id: rows[0].iq_answer6Id,
					link: rows[0].answer6
		    }])
		};
	}, updateRemainingIqQuestions = function() {
		 iqMysqlHandler
		.updateRemainingIqQuestions()
		.catch(function(error) {
			console.log('Error while updating global remaining IQ questions', error.message);
		});
	}, sendNewQuestion = function (userId, res) {
		var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
		 iqMysqlHandler
		.getQuestionById(random)
		.then(function(rows) {
			    var timeLimit = parseInt(rows[0].difficulty) === 0 ? genericConstants.GET_VALUES.IQ_TIME_LIMIT_EASY:
				 (parseInt(rows[0].difficulty) === 1? genericConstants.GET_VALUES.IQ_TIME_LIMIT_MEDIUM : 
				  genericConstants.GET_VALUES.IQ_TIME_LIMIT_HARD);
			 iqMysqlHandler
		    .setTimeout(userId, rows[0].iq_question_id)
		    .then(function() {
		    	res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(claims)});
				res.end(JSON.stringify(getIqExchangeModel(timeLimit, rows)));
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
	}, removeTimeout = function(forProfile, answer, claims, rows, res) {
		if(!forProfile) {
			 iqMysqlHandler
			.removeTimeout(claims)
			.then(function() {
				if(!answer) {
					claims.iqScore = rows[0].current_iq_score;
				 	sendNewQuestion(claims, res);
				} else {
					claims.iqQuestionsRemaining = parseInt(rows[0].remaining_iq_questions) > 0;
					res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(claims)});
					res.end();
				}
			})
			.catch(function(err) {
			});
		}
	}, updateEasyScore = function(forProfile, answer, claims, correct, trace, res) {
		 iqMysqlHandler
		.updateUserScoreEasy(forProfile?claims:claims.ky, correct)
		.then(function(rows) {
			removeTimeout(forProfile, answer, claims, rows, res);
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, updateMediumScore = function(forProfile, answer, claims, correct, trace, res) {
		 iqMysqlHandler
		.updateUserScoreMedium(forProfile?claims:claims.ky, correct)
		.then(function(rows) {
			removeTimeout(forProfile, answer, claims, rows, res);
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, updateHardScore = function(forProfile, answer, claims, correct, trace, res) {
		 iqMysqlHandler
		.updateUserScoreHard(forProfile?claims:claims.ky, correct)
		.then(function(rows) {
			removeTimeout(forProfile, answer, claims, rows, res);
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, updateScore = function(forProfile, answer, claims, difficulty, correct, trace, res) {
		switch(parseInt(difficulty)) {
			case 0: 
				updateEasyScore(forProfile, answer, claims, correct, trace, res);
			break;
			case 1:
				updateMediumScore(forProfile, answer, claims, correct, trace, res);
			break;
			case 2:
				updateHardScore(forProfile, answer, claims, correct, trace, res);
		}
	};

	if(!count) {
		count();
	}
	removeAllDifficultiesTimedOutQuestions();
	updateRemainingIqQuestions();

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		count();
	});

	//update remaining questions every day for everyone
	schedule.scheduleJob('* 10 * * *', function(){
		updateRemainingIqQuestions();
	});

	//should run every hour!
	schedule.scheduleJob('* * 1 * *', function(){
		removeAllDifficultiesTimedOutQuestions();
	});


	return {
		getRandomQuestionForProfile: function(res) {
			 var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
			 return iqMysqlHandler
			.getQuestionById(random)
			.then(function(rows) {
				return res.status(genericConstants.OK).json(getIqExchangeModel(null, rows));
			});
		},
		answerQuestionForProfile: function(userId, question, res) {
			 return iqMysqlHandler
			.getQuestionById(question.questionId)
			.then(function(rows) {
				 if(question.answerId === rows[0].correctAnswerId) {
					updateScore(true, true, userId, rows[0].difficulty, true, 'IQ-SRV-AQPRF', res);
				} else {
					updateScore(true, true, userId, rows[0].difficulty, false, 'IQ-SRV-AQPRF', res);
				}
			});
		},
		getRandomQuestion: function(claims, requestTime, res) {
			return iqMysqlHandler
			.getQuestionForUser(claims.ky)
			.then(function(rows) {
				var timeLimit = 0;
				if(rows.length>0) {
					 timeLimit = parseInt(rows[0].difficulty) === 0 ? genericConstants.GET_VALUES.IQ_TIME_LIMIT_EASY:
					 (parseInt(rows[0].difficulty) === 1? genericConstants.GET_VALUES.IQ_TIME_LIMIT_MEDIUM : 
					  genericConstants.GET_VALUES.IQ_TIME_LIMIT_HARD);
				}
				if(rows.length >0 && 
				parseInt(rows[0].diftime) < (timeLimit + 2*requestTime)) {
							res.status(genericConstants.OK).json(
								getIqExchangeModel(timeLimit-(rows[0].diftime + requestTime), rows));
				} else {
					if(rows.length > 0) {
						updateScore(false, false, claims, rows[0].difficulty, false, 'IQ-SRV-GRQ', res);
					} else {
						sendNewQuestion(claims, res);
					}
					
				}
			});
		},
		answerQuestion: function(claims, requestTime, question, res) {
			return iqMysqlHandler
			.getQuestionForUser(claims.ky)
			.then(function(rows) {
				var timeLimit = 0;
				if(rows.length > 0) {
						timeLimit = parseInt(rows[0].difficulty) === 0 ? genericConstants.GET_VALUES.IQ_TIME_LIMIT_EASY:
					 (parseInt(rows[0].difficulty) === 1? genericConstants.GET_VALUES.IQ_TIME_LIMIT_MEDIUM : 
					  genericConstants.GET_VALUES.IQ_TIME_LIMIT_HARD);
				}
				if(rows.length>0 &&
				parseInt(rows[0].diftime) > (timeLimit + 2*requestTime)) {
					  if(question.answerId === rows[0].correctAnswerId) {
							updateScore(false, true, claims, rows[0].difficulty, true, 'IQ-SRV-AQ', res);
					} else {
						    updateScore(false, true, claims, rows[0].difficulty, false, 'IQ-SRV-AQ', res);
					}
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						message: iqConstants.IQ_TIMEOUT.message
					});
				}
			});
		}
	};
};