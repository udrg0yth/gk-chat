module.exports = function(app, authConst) {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "http://localhost:9000");
	  res.header('Access-Control-Allow-Credentials', true);
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization");
	  res.header("Access-Control-Expose-Headers", "X-Auth-Token, Content-Type");
	  next();
	});
};