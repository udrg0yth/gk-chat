module.exports = function(application, gkConstants, genericConstants, gkMysqlHandler) {
	var schedule = require('node-schedule'),
		count = 0;

	var removeTimedOutQuestions = function() {
		 gkMysqlHandler
		.updateUserScoreGlobal(gkConstants.GK_TIMEOUT)
		.then(function() {
			gkMysqlHandler
		   .removeTimedOutQuestions(gkConstants.GK_TIMEOUT)
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
		  	count = rows[0].questionCount;
		 })
		.catch(function(error) {
		  	console.log('Error while counting gk questions!', error.message);
		 });
	};

	if(!count) {
		count();
		console.log("GK question count: ",count);
	}

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  count();
	});

	schedule.scheduleJob('10 * * * *', function(){
		  removeTimedOutQuestions();
	});


	return {
		getRandomQuestion: function(userId, res) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 
				&& parseInt(rows[0].diftime) > gkConstants.TIME_LIMIT) {
						 gkMysqlHandler
						.getQuestionById(rows[0].gk_question_id)
						.then(function(rows) {
							res.status(genericConstants.OK).json({
								timeLeft: rows[0].diftime,
								questionId: rows[0].gk_question_id,
								question: rows[0].gk_question,
								answers: gnericConstants.SHUFFLE_ARRAY(
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
				} else {
					 gkMysqlHandler
					.getQuestionById(genericConstants.GENERATE_RANDOM(count))
					.then(function(rows) {
						 gkMysqlHandler
					    .setTimeout(userId, rows[0].gk_question_id)
					    .then(function() {
					    	res.status(genericConstants.OK).json({

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
		answerQuestion: function(userId, answer) {
			return gkMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0 
				&& parseInt(rows[0].diftime) > gkConstants.TIME_LIMIT) {
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