module.exports = function(app) {
	var gkConst 	  =  require('./gk-questions-constants')();
	var gkQService   =  require('./gk-questions-service')(app, authConst);
  
    app.post(gkConst.getAllUrl, function(req, res) {
    	gkQService.getAll();
    });

};