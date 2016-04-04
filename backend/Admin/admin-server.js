module.exports = function(app) {
	var gkConst 	  =  require('./gk-questions-constants')();
	var gkQService   =  require('./gk-questions-service')(app);
  
    app.post(gkConst.getAllUrl, function(req, res) {
    	gkQService.getAll(res);
    });

};