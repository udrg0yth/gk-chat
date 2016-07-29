module.exports = function(application, gkConstants, genericConstants, gkMysqlHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeTimedOutQuestions = function() {
		 gkMysqlHandler
		.updateUserScoreGlobal(gkConstants.GK_TIME_LIMIT+2)
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
			console.log("GK question count: ",questionCount);
		 })
		.catch(function(error) {
		  	console.log('Error while counting gk questions!', error.message);
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
		answerQuestion: function(userId, requestTime, responseTime, answer) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 
				&& parseInt(rows[0].diftime) > (gkConstants.TIME_LIMIT 
				+ (parseInt(requestTime) + (Date.now()-responseTime)))) {
					if(rows[0].answer4 === answer) {
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