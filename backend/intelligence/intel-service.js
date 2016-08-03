module.exports = function(application, iqConstants, genericConstants, iqMysqlHandler) {
	var schedule = require('node-schedule'),
		count = 0;

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
		  	count = rows[0].questionCount;
		})
		.catch(function(error) {
		  	console.log('Error while counting iq questions!', error.message);
		});
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
		getRandomQuestion: function(userId, res) {
			return iqMysqlHandler
			.getQuestionForUser(userId)
			.then(function(rows) {
				console.log(rows);
				res.status(genericConstants.OK).json({
				});
			});
		}
	};
};