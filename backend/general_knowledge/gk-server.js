module.exports = function(application, genericConstants, tokenHandler, gkMysqlHandler) {
	var gkConstants		 	  	=  require('./gk-constants')(),
		gkService               =  require('./gk-service')(application, gkConstants, genericConstants, gkMysqlHandler);

	application.get(genericConstants.RANDOM_GK_QUESTION_URL, function(req, res){
	});
};