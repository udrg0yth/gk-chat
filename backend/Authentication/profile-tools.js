module.exports = function(authConst) {
	var maxIqDistance = 70.0,
		maxAgeDistance = 60.0;
	var personalityScore = {
		INFP: {
			INFP: 0.8,
			ENFP: 0.8,
			INFJ: 0.8,
			ENFJ: 1.0,
			INTJ: 0.8,
			ENTJ: 1.0,
			INTP: 0.8,
			ENTP: 0.8,
			IFSP: 0.2,
			ESFP: 0.2,
			ISTP: 0.2,
			ESTP: 0.2,
			ISFJ: 0.2,
			ESFJ: 0.2,
			ISTJ: 0.2,
			ESTJ: 0.2
		},
		ENFP: {
			INFP: 0.8,
			ENFP: 0.8,
			INFJ: 1.0,
			ENFJ: 0.8,
			INTJ: 1.0,
			ENTJ: 0.8,
			INTP: 0.8,
			ENTP: 0.8,
			IFSP: 0.2,
			ESFP: 0.2,
			ISTP: 0.2,
			ESTP: 0.2,
			ISFJ: 0.2,
			ESFJ: 0.2,
			ISTJ: 0.2,
			ESTJ: 0.2
		}
	};
	return {
		computeIq: function(data) {
			return 90 + data.correct_easy_iq_questions/data.total_easy_iq_questions * 30 +
					 + data.correct_medium_iq_questions/data.total_medium_iq_questions * 20 +
					 + data.correct_hard_iq_questions/data.total_hard_iq_questions * 10;
		},
		computeGeneralKnowledge: function(data) {
			return data.correct_gk_questions/data.total_gk_questions;
		},
		matchScore: function(firstUser, secondUser) {
			return 0.4 * personalityScore[firstUser.personalityType][secondUser.personalityType] +
				   0.25 * (1.0 - Math.abs(firstUser.iqScore - secondUser.iqScore)/maxIqDistance)  +
				   0.25 * (1.0 - Math.abs(firstUser.gkScore - secondUser.gkScore)) + 
				   0.1 * (1.0 - Math.abs(firstUser.age - secondUser.age)/maxAgeDistance);
		}
	};
};