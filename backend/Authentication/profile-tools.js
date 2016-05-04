module.exports = function(authConst) {
	
	return {
		computeIq: function(data) {
			return 90 + data.correct_easy_iq_questions/data.total_easy_iq_questions * 30 +
					 + data.correct_medium_iq_questions/data.total_medium_iq_questions * 20 +
					 + data.correct_hard_iq_questions/data.total_hard_iq_questions * 10;
		},
		computeGeneralKnowledge: function(data) {
			return data.correct_gk_questions/data.total_gk_questions;
		}
	};
};