module.exports = function(app) {
	var gkConst = require('./gk-questions-constants.js')();
	var mysqlHandler  =  require('./mysql-handler')(app, gkConst);

	return {
		'getAll': function(res) {
			return mysqlHandler
				.getAll()
				.then(function(data) {
					res.status(200).json({questions:data});
				});
		},
		'saveQuestion': function(data, res) {
			return mysqlHandler
				.saveQuestion(data)
				.then(function() {
					res.status(200).json({});
				});
		},
		'updateQuestion': function(data, res) {
			return mysqlHandler
				.updateQuestion(data)
				.then(function() {
					res.status(200).json({});
				});
		}
	};
};