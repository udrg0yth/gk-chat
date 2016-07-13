module.exports = function(genericConstants, connection) {
	var schedule = require('node-schedule'),
		statistics = {};

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT current_personality, count(*) AS countPerPersonality FROM ' + genericConstants.USER_TABLE
		   + ' GROUP BY current_personality';
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	statistics.personalityStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.lor('Error while gathering personality statistics!', error.message);
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
		  	statistics.generalKnowledgeStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.lor('Error while gathering general knowledge statistics!', error.message);
		  });
	});

	//should run every day!
	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT FORMAT(STD(iq_score),2) AS standardDeviation, '
		  + 'AVG(iq_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
		  console.log(queryString);
		  connection
		  .query(queryString)
		  .then(function(rows) {
		  	statistics.iqStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.lor('Error while gathering IQ statistics!', error.message);
		  });
	});

	schedule.scheduleJob('10 * * * *', function(){
		  var queryString = 'SELECT gender, count(*) AS genderCount FROM ' + genericConstants.USER_TABLE
			 + ' GROUP BY gender';
			console.log(queryString);

		    connection
		   .query(queryString)
		   .then(function(rows) {
		    	statistics.genderStatistics = rows[0];
		   })
		   .catch(function(error) {
		  	    console.lor('Error while gathering gender statistics!', error.message);
		   });
	});

	function retrieveUserByTemplate(column, data) {
		var queryString = genericConstants
						.SELECT_TEMPLATE
						.replace('$columns', genericConstants.USER_COLUMNS_WITH_ID)
						.replace('$table', genericConstants.USER_TABLE)
					   + genericConstants.CRITERIA_TEMPLATE
						.replace('$criteria', column + '="' + data + '"');
		console.log(queryString);
		return connection.query(queryString);
	};

	
	return {
		getStatistics: function() {
			return statistics;
		},
		setUserProfile: function(profile) {
			var values = '"' + profile.username + '",' +
			             '"' + profile.birthdate + '",' +
			             '"' + profile.gender + '"';

			var queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.USER_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);
		},
		registerUser: function(user) {
			var values = '"' + user.email + '",' +
			             '"' + user.password + '",' +
			             '"' + user.accountStatus + '",' +
			             '"' + 150 + '",' +
			             '"' + 1 + '",' +
			             '"0.0.0.0",' +
			             '"ESFJ,"' +
			             '"' + 0 + '",' + 
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '",' +
			             '"' + 0 + '"';
			var queryString = genericConstants
							.INSERT_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.REGISTRATION_COLUMNS)
							.replace('$values', values);
			return connection.query(queryString);
		},
		activateAccount: function(userId) {
			var map = 'account_status="ACTIVE"',
				queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$map', map)
						 +    genericConstants
						 	.CRITERIA_TEMPLATE
						 	.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		},
		retrieveUserById: function(userId) {
			return retrieveUserByTemplate('user_id', userId);
		},
		retrieveUserByEmail: function(email) {
			return retrieveUserByTemplate('email', email);
		},
		retrieveUserByUsername: function(username) {
			return retrieveUserByTemplate('username', username);
		}
	};
};