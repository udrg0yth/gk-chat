module.exports = function(application, gkConstants, genericConstants, gkMysqlHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeTimedOutQuestions = function() {
		 gkMysqlHandler
		.updateUserScoreGlobal(gkConstants.GK_TIME_LIMIT)
		.then(function() {
			gkMysqlHandler
		   .removeTimedOutQuestions(gkConstants.GK_TIME_LIMIT)
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
	}, updateScore = function(correct, claims, forProfile, answer, iq_questions, remaining) {
		 iqMysqlHandler
		.updateUserScore(claims, correct)
		.then(function() {
			if(!forProfile) {
				 iqMysqlHandler
				.removeTimeout(claims)
				.then(function() {
					if(!answer) {
					 sendNewQuestion(claims, res);
					} else {
						claims.gkQuestionsRemaining = remaining > 0;
						res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(claims)});
						res.end();
					}
				});
			}
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, sendNewQuestion = function(userId, res) {

	}, updateRemainingIqQuestions = function() {
		 gkMysqlHandler
		.updateRemainingGKQuestions()
		.catch(function(error) {
			console.log('Error while updating global remaining IQ questions', error.message);
		});
	};

	if(!questionCount) {
		count();
	}

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
			 gkMysqlHandler
			.getQuestionById(random)
			.then(function(rows) {
				return res.status(genericConstants.OK).json(getGKExchangeModel(null, rows));
			})
			.catch(function(error) {
				return res.status(genericConstants.INTERNAL_ERROR).json({
					message: error.message,
					trace: 'GK-SCE-GRQPRF'
				});
			});
		},
		answerQuestionForProfile: function(userId, question, res) {
			 iqMysqlHandler
			.getQuestionById(question.questionId)
			.then(function(rows) {
				 if(question.answerId === rows[0].answer4) {
					updateScore(true, true, userId, rows[0].difficulty, true, 'GK-SCE-AQPRF', res);
				} else {
					updateScore(true, true, userId, rows[0].difficulty, false, 'GK-SCE-AQPRF', res);
				}
			})
			.catch(function(error) {
				return res.status(genericConstants.INTERNAL_ERROR).json({
					message: error.message,
					trace: 'IQ-SCE-AQPRF'
				});
			});
		},
		getRandomQuestion: function(userId, requestTime, res) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 
				&& parseInt(rows[0].diftime) < (gkConstants.GK_TIME_LIMIT  + 2*requestTime)) {
							res.status(genericConstants.OK).json(
								getIqExchangeModel(gkConstants.GK_TIME_LIMIT -(rows[0].diftime + requestTime), rows));
				} else {
					if(rows.length > 0) {
						updateScore(false, false, userId, rows[0].difficulty, false, 'IQ-SCE-GRQ', res);
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
				if(rows.length > 0) {
					var timeLimit = parseInt(rows[0].difficulty) == 0 ? iqConstants.IQ_TIME_LIMIT_EASY:
					 (parseInt(rows[0].difficulty) == 1? iqConstants.IQ_TIME_LIMIT_MEDIUM : 
					  iqConstants.IQ_TIME_LIMIT_HARD);
				}
				if(rows.length>0 
				&& parseInt(rows[0].diftime) > (timeLimit 
				+ 2*requestTime)) {
					  if(question.answerId === rows[0].correctAnswerId) {
							updateScore(false, true, claims, rows[0].difficulty, true, 'IQ-SRV-AQ', res, updatedScoreRows.iq_questions_remaining);
					} else {
						    updateScore(false, true, claims, rows[0].difficulty, false, 'IQ-SRV-AQ', res, updatedScoreRows.iq_questions_remaining);
					}
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						message: iqConstants.IQ_TIMEOUT.message
					});
				}
			});
		}
		getRandomQuestion: function(userId, requestTime, responseTime, res) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(requestTime && responseTime && rows.length>0 
				&& parseInt(rows[0].diftime) < (gkConstants.GK_TIME_LIMIT 
					+ (parseInt(requestTime) + (Date.now()-responseTime))/1000)) {
						 gkMysqlHandler
						.getQuestionById(rows[0].gk_question_id)
						.then(function(rows2) {
							console.log(rows[0].diftime);
							res.status(genericConstants.OK).json({
								timeLeft: rows[0].diftime + (Date.now()-responseTime)/1000,
								timestamp: Date.now(),
								questionId: rows2[0].gk_question_id,
								question: rows2[0].gk_question,
								answers: genericConstants.SHUFFLE_ARRAY(
									[rows2[0].gk_answer1,
									rows2[0].gk_answer2,rows2[0].gk_answer3,
									rows2[0].gk_answer4])
							});
						})
						.catch(function(error) {
							res.status(genericConstants.INTERNAL_ERROR).json({
								message: error.message,
								trace: 'GK-SCE-GRQ'
							});
						});
				} else {
					console.log(gkConstants);
					var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
					 gkMysqlHandler
					.getQuestionById(random)
					.then(function(rows) {
						 gkMysqlHandler
					    .setTimeout(userId, rows[0].gk_question_id)
					    .then(function() {
					    	console.log(gkConstants.GK_TIME_LIMIT);
					    	res.status(genericConstants.OK).json({
					    		timeLeft: gkConstants.GK_TIME_LIMIT,
								timestamp: Date.now(),
								questionId: rows[0].gk_question_id,
								question: rows[0].gk_question,
								answers: genericConstants.SHUFFLE_ARRAY(
									[rows[0].gk_answer1,
									rows[0].gk_answer2,rows[0].gk_answer3,
									rows[0].gk_answer4])
					    	});
					    })
					    .catch(function(error) {
					    	res.status(genericConstants.INTERNAL_ERROR).json({
								message: error.message,
								trace: 'GK-SCE-GRQ'
							});
					    });
					})
					.catch(function(error) {
						res.status(genericConstants.INTERNAL_ERROR).json({
							message: error.message,
							trace: 'GK-SCE-GRQ'
						});
					})
				}
			});
		},
		answerQuestion: function(userId, quiz) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 
				&& parseInt(rows[0].diftime) > (gkConstants.TIME_LIMIT 
				+ (parseInt(quiz.requestTime) + (Date.now()-quiz.responseTime)))) {
					if(rows[0].answer4 === quiz.answer) {
						 gkMysqlHandler
						.updateUserScore(userId, true)
						.then(function() {
							gkMysqlHandler
							.removeTimeout()
							.then(function() {
								res.status(genericConstants.OK).json({});
							})
						})
						.catch(function(error) {
							res.status(genericConstants.INTERNAL_ERROR).json({
								message: error.message,
								trace: 'GK-SCE-AQ'
							});
						});
					} else {
						gkMysqlHandler
						.updateUserScore(userId, false)
						.then(function() {
							gkMysqlHandler
							.removeTimeout()
							.then(function() {
								res.status(genericConstants.OK).json({});
							})
						})
						.catch(function(error) {
							res.status(genericConstants.INTERNAL_ERROR).json({
								message: error.message,
								trace: 'GK-SCE-AQ'
							});
						});
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