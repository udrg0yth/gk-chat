module.exports = function(application, iqConstants, genericConstants, iqMysqlHandler, tokenHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeTimedOutQuestions = function(difficulty, timeout) {
		 iqMysqlHandler
		.updateUserScoreGlobal(difficulty, timeout)
		.then(function() {
			iqMysqlHandler
		   .removeTimedOutQuestions(difficulty, timeout)
		   .catch(function(error) {
		   		console.log('Error while cleaning gk_question_user from timed out questions!', error.message);
		   });
		})
		.catch(function(error) {
	   		console.log('Error while updating score for timed out questions!', error.message);
	   });
	}, removeAllDifficultiesTimedOutQuestions = function() {
		removeTimedOutQuestions(0, iqConstants.IQ_TIME_LIMIT_EASY);
		removeTimedOutQuestions(1, iqConstants.IQ_TIME_LIMIT_MEDIUM);
  		removeTimedOutQuestions(2, iqConstants.IQ_TIME_LIMIT_HARD);
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
		return {
			timeLeft: timeLimit,
			questionId: rows[0].iq_question_id,
			question: rows[0].question,
			answers: genericConstants.SHUFFLE_ARRAY(
			[{ 
				id: rows[0].answer1Id,
				link: rows[0].answer1
			}, {
					id: rows[0].answer2Id,
					link: rows[0].answer2
			}, {
					id: rows[0].answer3Id,
					link: rows[0].answer3
			}, {
					id: rows[0].answer4Id,
					link: rows[0].answer4
			}, {
					id: rows[0].answer5Id,
					link: rows[0].answer5
			}, {
					id: rows[0].answer6Id,
					link: rows[0].answer6
		    }])
		};
	}, updateRemainingIqQuestions = function() {
		 iqMysqlHandler
		.updateRemainingIqQuestions()
		.catch(function(error) {
			console.log('Error while updating global remaining IQ questions', error.message);
		});
	};

	if(!count) {
		count();
		console.log("IQ question count: ",count);
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

	var sendNewQuestion = function (userId, res) {
		var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
		 iqMysqlHandler
		.getQuestionById(random)
		.then(function(rows) {
			    var timeLimit = parseInt(rows[0].difficulty) == 0 ? iqConstants.IQ_TIME_LIMIT_EASY:
				 (parseInt(rows[0].difficulty) == 1? iqConstants.IQ_TIME_LIMIT_MEDIUM : 
				  iqConstants.IQ_TIME_LIMIT_HARD);
			 iqMysqlHandler
		    .setTimeout(userId, rows[0].iq_question_id)
		    .then(function() {
		    	res.status(genericConstants.OK).json(getIqExchangeModel(timeLimit, rows));
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
	}, updateScore = function(forProfile, answer, claims, difficulty, correct, trace, res, remaining) {
		 iqMysqlHandler
		.updateUserScore(claims, parseInt(difficulty), true)
		.then(function() {
			if(!forProfile) {
				 iqMysqlHandler
				.removeTimeout(claims)
				.then(function() {
					if(!answer) {
					 sendNewQuestion(claims, res);
					} else {
						claims.iqQuestionsRemaining = remaining > 0;

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
	};

	return {
		getRandomQuestionForProfile: function(res) {
			 var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
			 iqMysqlHandler
			.getQuestionById(random)
			.then(function(rows) {
				return res.status(genericConstants.OK).json(getIqExchangeModel(null, rows));
			})
			.catch(function(error) {
				return res.status(genericConstants.INTERNAL_ERROR).json({
					message: error.message,
					trace: 'IQ-SRV-GRQPRF'
				});
			});
		},
		answerQuestionForProfile: function(userId, question, res) {
			 iqMysqlHandler
			.getQuestionById(question.questionId)
			.then(function(rows) {
				 if(question.answerId === rows[0].correctAnswerId) {
					updateScore(true, true, userId, rows[0].difficulty, true, 'IQ-SRV-AQPRF', res);
				} else {
					updateScore(true, true, userId, rows[0].difficulty, false, 'IQ-SRV-AQPRF', res);
				}
			})
			.catch(function(error) {
				return res.status(genericConstants.INTERNAL_ERROR).json({
					message: error.message,
					trace: 'IQ-SRV-AQPRF'
				});
			});
		},
		getRandomQuestion: function(userId, requestTime, res) {
			return iqMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				var timeLimit = 0;
				if(rows.length>0) {
					 timeLimit = parseInt(rows[0].difficulty) == 0 ? iqConstants.IQ_TIME_LIMIT_EASY:
					 (parseInt(rows[0].difficulty) == 1? iqConstants.IQ_TIME_LIMIT_MEDIUM : 
					  iqConstants.IQ_TIME_LIMIT_HARD);
				}
				if(rows.length>0 
				&& parseInt(rows[0].diftime) < (timeLimit + 2*requestTime)) {
							res.status(genericConstants.OK).json(
								getIqExchangeModel(timeLimit-(rows[0].diftime + requestTime), rows));
				} else {
					if(rows.length > 0) {
						updateScore(false, false, userId, rows[0].difficulty, false, 'IQ-SRV-GRQ', res);
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
	};
};