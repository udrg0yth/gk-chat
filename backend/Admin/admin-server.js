module.exports = function(app) {
	var gkConst 	  =  require('./gk-questions-constants')();
	var gkQService   =  require('./gk-questions-service')(app);
  
    app.get(gkConst.getAllUrl, function(req, res) {
    	gkQService.getAll(res);
    });

    app.get(gkConst.getAllCatUrl, function(req, res) {
    	gkQService.getAllCategories(res);
    });
};