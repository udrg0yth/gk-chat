module.exports = function(genericConstants, connection) {
	var schedule = require('node-schedule'),
		count = 0,
		averageScore = 0,
		standardDeviation = 0;

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT count(*) AS questionCount FROM ' + genericConstants.GK_QUESTION_TABLE;
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	count = rows[0].questionCount;
		  })
		  .catch(function(error) {
		  	console.lor('Error while counting gk questions!', error.message);
		  });
	});

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT FORMAT(STD(gk_score),2) AS standardDeviation, '
		  + 'AVG(gk_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	averageScore = rows[0].averageScore;
		  	standardDeviation = rows[0].standardDeviation;
		  })
		  .catch(function(error) {
		  	console.lor('Error getting gk score standard deviation and average!', error.message);
		  });
	});

	return  {
		getRandomQuestion: function() {
			//if user already received a question
			//if the question is timed out remove it and send a random question
			//if not return the question
			var queryString = genericConstants
							.SELECT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_COLUMNS)
							+ genericConstants.CRITERIA_TEMPLATE
							.replace('$criteria', 'gk_question_id="' + genericConstants.GENERATE_RANDOM(count) + '"');
		},
		answerQuestion: function(userId, question) {
			//check if answer is correct answer
			//update total questions and correct questions for user(token)
		},
		saveQuestion: function(question) {
			var values = '"' + question.question + '",' +
						 '"' + question.answer1 + '",' +
						 '"' + question.answer2 + '",' +
						 '"' + question.answer3 + '",' +
						 '"' + question.answer4 + '",' +
						 '"' + question.category + '"',
				queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.GK_QUESTION_TABLE)
							.replace('$columns', genericConstants.GK_QUESTION_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);			 
		}
	};
};