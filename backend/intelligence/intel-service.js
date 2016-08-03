module.exports = function(application, iqConstants, genericConstants, iqMysqlHandler) {
	var schedule = require('node-schedule'),
		questionCount = 0;

	var removeTimedOutQuestions = function() {
			 /*iqMysqlHandler
			.updateUserScoreGlobal(iqConstants.GK_TIMEOUT)
			.then(function() {
				iqMysqlHandler
			   .removeTimedOutQuestions(iqConstants.GK_TIMEOUT)
			   .catch(function(error) {
			   		console.log('Error while cleaning gk_question_user from timed out questions!', error.message);
			   });
			})
			.catch(function(error) {
		   		console.log('Error while updating score for timed out questions!', error.message);
		   });*/
	}, count = function() {
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
			timestamp: Date.now(),
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
	};

	if(!count) {
		count();
		console.log("IQ question count: ",count);
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
			return iqMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				if(rows.length>0)
				var timelimit = parseInt(rows[0].difficulty) == 0 ? iqConstants.IQ_TIME_LIMIT_EASY:
					 (parseInt(rows[0].difficulty) == 1? iqConstants.IQ_TIME_LIMIT_MEDIUM : 
					  iqConstants.IQ_TIME_LIMIT_HARD);
				if(requestTime && responseTime && rows.length>0 
				&& parseInt(rows[0].diftime) < (timelimit
					+ (parseInt(requestTime) + (Date.now()-responseTime))/1000)) {
							res.status(genericConstants.OK).json(
								getIqExchangeModel(rows[0].diftime + (Date.now()-responseTime)/1000, rows));
				} else {
					var random  = genericConstants.GENERATE_RANDOM(questionCount)+1;
					console.log(random);
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
					})
				}
			});
		}
	};
};