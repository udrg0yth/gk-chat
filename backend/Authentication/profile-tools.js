module.exports = function(authConstants) {
	
	return {
		computeIq: function(data) {
			return 50 + (data.correct_easy_iq_questions/(data.total_easy_iq_questions + 1) * 110) +
					 + (data.correct_medium_iq_questions/(data.total_medium_iq_questions + 1) * 80) +
					 + (data.correct_hard_iq_questions/(data.total_hard_iq_questions + 1) * 60);
		},
		computeGeneralKnowledge: function(data) {
			return data.correct_gk_questions/data.total_gk_questions;
		}
	};
};

40