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
		}
	};
}