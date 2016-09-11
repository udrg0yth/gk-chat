module.exports = function(application, authenticationConstants, genericConstants, tokenHandler, authMysqlHandler, personalityMysqlHandler, iqMysqlHandler, gkMysqlHandler, genericTools, personalityTools) {
	var authenticationTools 	 =  require('./authentication-tools')(authenticationConstants),
		schedule = require('node-schedule'),
		statistics = {};

	var gatherStatistics = function() {
			authMysqlHandler
		  .gatherPersonalityStatistics()
		  .then(function(rows) {
		  	statistics.personalityStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.log('Error while gathering personality statistics!', error.message);
		  });

		    authMysqlHandler
		  .gatherGeneralKnowledgeStatistics()
		  .then(function(rows) {
		 	statistics.generalKnowledgeStatistics = rows[0];
		  })
		  .catch(function(error) {
			console.log('Error while gathering general knowledge statistics!', error.message);
		  });

		  	authMysqlHandler
		  .gatherIQStatistics()
		  .then(function(rows) {
		  	statistics.iqStatistics = rows[0];
		  })
		  .catch(function(error) {
		  	console.log('Error while gathering IQ statistics!', error.message);
		  });
	}, getPersonalityExchangeModel = function(rows) {
		return {
			questionId: rows[0].personality_question_id,
			negativelyAffectedType: rows[0].negatively_affected_type,
			question: rows[0].personality_question
		};
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
	}, updateGKScore = function(forToken, claims, correct, trace, res) {
		 gkMysqlHandler
		.updateUserScore(claims, correct)
		.then(function(gk) {
			 authMysqlHandler
			.getIqGkScore(claims)
			.then(function(scores) {
				forToken.iqScore = scores[0].current_iq_score;
				forToken.gkScore = scores[0].current_gk_score;
				res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(forToken)});
				res.end();
			});
			
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	}, updateIqScore = function(forToken, claims, gkAnswer, correct, trace, res) {
		 iqMysqlHandler
		.updateUserScoreEasy(claims, correct)
		.then(function(iq) {
			 gkMysqlHandler
			.getQuestionById(gkAnswer.questionId)
			.then(function(gk) {
				 if(gkAnswer.answer === gk[0].answer4) {
					updateGKScore(forToken, claims, true, 'A-SCE-AQPRF', res);
				} else {
					updateGKScore(forToken, claims, false, 'A-SCE-AQPRF', res);
				}
			});
		})
		.catch(function(error) {
			res.status(genericConstants.INTERNAL_ERROR).json({
				message: error.message,
				trace: trace
			});
		});
	};


	if( Object.keys(statistics).length === 0) {
		  gatherStatistics();
	}

	//should run every day!
	schedule.scheduleJob('1 * * * *', function(){
		  gatherStatistics();
	});

	return {
		getStatistics: function(res) {
			res.status(genericConstants.OK).json(statistics);
		},
		verifyToken: function(token) {
			return tokenHandler.verifyToken(token);
		},
		checkEmailExistence: function(email){
			return authMysqlHandler
			.checkEmailExistence(email);
		},
		checkUsernameExistence: function(username) {
		    return authMysqlHandler
			.checkUsernameExistence(username);
		},
		resendEmail: function(email, res) {
			return authMysqlHandler
		    .getIdFromEmail(email)
		    .then(function(rows) {
				if(rows.length > 0) {
					var message = 
					authenticationConstants.EMAIL_TEMPLATE.replace('$hash', genericTools.encrypt(rows[0].user_id.toString()));
					authenticationTools.sendActivationLink(email, message);
				} else {
					res.status(genericConstants.UNAUTHORIZED).json({
						message: authenticationConstants.BAD_CREDENTIALS.message
					});
				}
			});
		},
		activateAccount: function(hash, res) {
			var userId = genericTools.decrypt(hash);
			return authMysqlHandler
					.getAccountStatus(userId)
					.then(function(rows) {
						if(rows[0].account_status === 'ACTIVE') {
							res.status(genericConstants.UNAUTHORIZED).json({
								message: authenticationConstants.ACCOUNT_ALREADY_ACTIVE.message
							});
						} else {
							authMysqlHandler
						    .activateAccount(userId)
						    .then(function(rows) {
						    	res.status(genericConstants.OK).json({});
							})
							.catch(function(error) {
								res.status(genericConstants.INTERNAL_ERROR).json({
									message: error.message,
									trace: 'A-SCE-AA'
								});
							});
						}
					});
		},
		getProfileQuestions: function(hash, res) {
			 var userId = genericTools.decrypt(hash);
			 return personalityMysqlHandler
			.getNextQuestion(userId)
			.then(function(personality) {
				 return iqMysqlHandler
				.getQuestionById(genericConstants.GET_VALUES.PROFILE_IQ_QUESTION)
				.then(function(iq) {
					 gkMysqlHandler
					.getQuestionById(genericConstants.GET_VALUES.PROFILE_GK_QUESTION)
					.then(function(gk) {
						  res.status(genericConstants.OK).json({
							personalityQuestion: getPersonalityExchangeModel(personality),
							iqQuestion: getIqExchangeModel(null, iq),
							gkQuestion: getGKExchangeModel(null, gk)
						  });
					});
				});
			});
		},
		loginUser: function(header, res) {
			var credentials = authenticationTools.getCredentials(header);

			return authMysqlHandler
				.getUserDataByEmail(credentials[0])
				.then(function(rows) {
					if(rows.length === 0) {
						return res.status(genericConstants.UNAUTHORIZED).json({
							message: authenticationConstants.BAD_CREDENTIALS.message
						});
					}
					if(rows[0].account_status === 'INACTIVE') {
						return res.status(genericConstants.UNAUTHORIZED).json({
							message: authenticationConstants.INACTIVE_ACCOUNT.message
						});
					} else {
						if(!rows[0].username) {
							return res.status(genericConstants.UNAUTHORIZED).json({
								message: authenticationConstants.INCOMPLETE_PROFILE.message
							});
						} 
					}

					if(!authenticationTools.checkPasswords(credentials[1], rows[0].password)) {
						return res.status(genericConstants.UNAUTHORIZED).json({
							message: authenticationConstants.BAD_CREDENTIALS.message
						});
					} 
					console.log(rows[0]);
					
					var user = {};
						user.isMember = new Date(user.membership_expiration) <= new Date();
						if(!user.isMember) {
							user.iqQuestionsRemaining = parseInt(rows[0].remaining_iq_questions) > 0;
							user.gkQuestionsRemaining = parseInt(rows[0].remaining_gk_questions) > 0;
							user.matchTrialsRemaining = parseInt(rows[0].remaining_match_trials) > 0;
						}
						user.id = rows[0].user_id;
						user.username = rows[0].username;
						user.age = authenticationTools.computeAge(rows[0].birthdate);
						user.gender = rows[0].gender;
						user.iqScore = rows[0].current_iq_score;
						user.gkScore = rows[0].current_gk_score;
						user.personality = rows[0].current_personality;

					res.writeHead(genericConstants.OK, {'X-Auth-Token': tokenHandler.generateToken(user)});
					res.end();
				});
		},
		registerUser: function(header, sendEmail, res) {
			var credentials = authenticationTools.getCredentials(header),
			data = {
				email: credentials[0],
				password: authenticationTools.hashPassword(credentials[1]),
				accountStatus: 'INACTIVE'
			};

			return authMysqlHandler
				.registerUser(data)
				.then(function(data) {
					 authMysqlHandler
					.getEmailFromId(data.insertId)
					.then(function(user) {
						var encryptedId = genericTools.encrypt(data.insertId.toString()),
							message = 
								authenticationConstants.EMAIL_TEMPLATE.replace('$hash', encryptedId);
						if(sendEmail) {
							authenticationTools.sendActivationLink(user[0].email, message);
							res.status(genericConstants.OK).json({});
						} else {
							res.status(genericConstants.OK).json({
								hash: encryptedId
							});
						}
					})
					.catch(function(error) {
						return res.status(genericConstants.INTERNAL_ERROR).json({
							message: error.message,
							trace: 'A-SCE-R'
						});
					});
				});
		},
		setUserProfile: function(data, res) {
				var userId = genericTools.decrypt(data.hash);
				return authMysqlHandler
					.setUserBasicInfo(userId, data.basicInfo)
					.then(function(basicInfo) {
						 personalityMysqlHandler
						.getCurrentPersonalityRaw(userId)
						.then(function(personality) {
							var updatedPersonality = personalityTools.updatePersonality(personality[0].current_personality_raw, 
								parseInt(data.personalityAnswer.negativelyAffectedType), data.personalityAnswer.answer),
								formattedPersonality = personalityTools.formatPersonality(updatedPersonality),
								reducedPersonality = personalityTools.reducePersonality(formattedPersonality);
							 personalityMysqlHandler
							.updateNextQuestionAndPersonality(userId, updatedPersonality,
									reducedPersonality)
							.then(function(currentPersonality) {
								var forToken = {
									id: basicInfo.insertId,
									isMember: false,
									iqQuestionsRemaining: true,
									gkQuestionsRemaining: true,
									matchTrialsRemaining: true,
									username: data.basicInfo.username,
									age: authenticationTools.computeAge(data.basicInfo.birthdate),
									gender: data.basicInfo.gender,
									personality: reducedPersonality,
								};

								 iqMysqlHandler
								.getQuestionById(data.iqAnswer.questionId)
								.then(function(iq) {
									 if(data.iqAnswer.answer === iq[0].correctAnswerId) {
										updateIqScore(forToken, userId, data.gkAnswer, true, 'IQ-SRV-AQPRF', res);
									} else {
										updateIqScore(forToken, userId, data.gkAnswer, false, 'IQ-SRV-AQPRF', res);
									}
								});
							});
						});
					});
		},
		getHash: function(email, res) {
			return authMysqlHandler
			.getIdFromEmail(email)
			.then(function(rows) {
				if(rows.length === 0) {
					return res.status(genericConstants.UNAUTHORIZED).json({
						message: authenticationConstants.BAD_CREDENTIALS.message
					});
				}

				res.status(genericConstants.OK).json({
					hash: genericTools.encrypt(rows[0].user_id.toString())
				});
			});
		},
		checkHash: function(hash, res) {
			var userId = genericTools.decrypt(hash);
			return authMysqlHandler
			.checkProfileCompletionById(userId)
			.then(function(rows) {
				if(rows.length === 0 || (rows.length > 0 && rows[0].username)) {
					return res.status(genericConstants.UNAUTHORIZED).json({
						message: genericConstants.BAD_DATA.message
					});
				} 

				res.status(genericConstants.OK).json({});
			});
		},
		logoutUser: function() {
		}
	};
};