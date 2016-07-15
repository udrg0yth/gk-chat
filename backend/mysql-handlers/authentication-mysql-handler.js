module.exports = function(genericConstants, connection) {
	var schedule = require('node-schedule'),
		statistics = {};

    var gatherPersonalityStatistics = function() {
	    		var queryString = 'SELECT current_personality as personality, count(*) AS count FROM ' + genericConstants.USER_TABLE
			   + ' GROUP BY current_personality';
			  console.log(queryString);
			  connection
			  .query(queryString)
			  .then(function(rows) {
			  	statistics.personalityStatistics = rows[0];
			  })
			  .catch(function(error) {
			  	console.log('Error while gathering personality statistics!', error.message);
			  });
		},
		gatherGeneralKnowledgeStatistics = function() {
				var queryString = 'SELECT FORMAT(STD(current_gk_score),2) AS standardDeviation, '
			  + 'AVG(current_gk_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
			  console.log(queryString);
			  connection
			  .query(queryString)
			  .then(function(rows) {
			  	statistics.generalKnowledgeStatistics = rows[0];
			  })
			  .catch(function(error) {
			  	console.log('Error while gathering general knowledge statistics!', error.message);
			  });
		},
		gatherIQStatistics = function() {
				var queryString = 'SELECT FORMAT(STD(current_iq_score),2) AS standardDeviation, '
			  + 'AVG(current_iq_score) AS averageScore FROM ' + genericConstants.USER_TABLE;
			  console.log(queryString);
			  connection
			  .query(queryString)
			  .then(function(rows) {
			  	statistics.iqStatistics = rows[0];
			  })
			  .catch(function(error) {
			  	console.log('Error while gathering IQ statistics!', error.message);
			  });
		},
		gatherGenderStatistics = function() {
				  var queryString = 'SELECT gender, count(*) AS count FROM ' + genericConstants.USER_TABLE
				 + ' GROUP BY gender';
				console.log(queryString);

			    connection
			   .query(queryString)
			   .then(function(rows) {
			    	statistics.genderStatistics = rows[0];
			   })
			   .catch(function(error) {
			  	    console.log('Error while gathering gender statistics!', error.message);
			   });
		};

	if( Object.keys(statistics).length === 0) {
		  gatherPersonalityStatistics();
		  gatherGeneralKnowledgeStatistics();
		  gatherIQStatistics();
		  gatherGenderStatistics();
	}

	//should run every day!
	schedule.scheduleJob('1 * * * *', function(){
		  gatherPersonalityStatistics();
		  gatherGeneralKnowledgeStatistics();
		  gatherIQStatistics();
		  gatherGenderStatistics();
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
		setUserProfile: function(userId, profile) {
			var map = 'username="'  + profile.username + '",' +
			          'birthdate="' + profile.birthdate + '",' +
			          'gender="'    + profile.gender + '"';

			var queryString = genericConstants
							.UPDATE_TEMPLATE
							.replace('$table', genericConstants.USER_TABLE)
							.replace('$columns', genericConstants.PROFILE_COLUMNS)
							.replace('$map', map)
							+ genericConstants
							.CRITERIA_TEMPLATE
							.replace('$criteria', 'user_id="' + userId + '"');
			return connection.query(queryString);
		},
		registerUser: function(user) {
			var values = '"' + user.email + '",' +
			             '"' + user.password + '",' +
			             '"' + user.accountStatus + '",' +
			             '"' + 150 + '",' +
			             '"' + 1 + '",' +
			             '"0.0.0.0",' +
			             '"ESFJ",' +
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
			console.log(queryString);
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
			console.log(queryString);
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