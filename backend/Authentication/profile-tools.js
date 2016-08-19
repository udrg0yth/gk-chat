module.exports = function(authConstants) {
	
	return {
		computeIq: function(data) {
			return 50 + ((data.correct_easy_iq_questions*(data.total_easy_iq_questions + 1))/(data.total_easy_iq_questions *(data.total_easy_iq_questions + 2))) * 60) +
					 + ((data.correct_medium_iq_questions*(data.total_medium_iq_questions + 1))/(data.total_medium_iq_questions *(data.total_medium_iq_questions + 2))) * 40) +
					 + ((data.correct_hard_iq_questions*(data.total_hard_iq_questions + 1))/(data.total_hard_iq_questions *(data.total_hard_iq_questions + 2))) * 30);
		},
		computeGeneralKnowledge: function(data) {
			return data.correct_gk_questions/data.total_gk_questions;
		}
	};
};

40