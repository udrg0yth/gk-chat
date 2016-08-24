module.exports = function(genericConstants) {
	var crypto = require('crypto');
	return  {
		encrypt: function(text) {
			  var cipher = crypto.createCipher(genericConstants.CRYPTO_ALGORITHM ,genericConstants.CRYPTO_SECRET),
			  	  crypted = cipher.update(text,'utf8','hex');
			  crypted += cipher.final('hex');
			  return crypted;
		},
		decrypt: function(text) {
			  var decipher = crypto.createDecipher(genericConstants.CRYPTO_ALGORITHM ,genericConstants.CRYPTO_SECRET),
			  	  dec = decipher.update(text,'hex','utf8');
			  dec += decipher.final('utf8');
			  return dec;
		},
		computeIq: function(data) {
			return genericConstants.FREE_IQ_WEIGHT + (data.correct_easy_iq_questions/(data.total_easy_iq_questions + 1) * genericConstants.EASY_IQ_WEIGHT) +
				   (data.correct_medium_iq_questions/(data.total_medium_iq_questions + 1) * genericConstants.MEDIUM_IQ_WEIGHT) +
				   (data.correct_hard_iq_questions/(data.total_hard_iq_questions + 1) * genericConstants.HARD_IQ_WEIGHT);
		},
		computeGeneralKnowledge: function(data) {
			return data.correct_gk_questions/data.total_gk_questions;
		}
	};
}