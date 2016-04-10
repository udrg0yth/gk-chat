module.exports = function(app, authConst) {
	var mysqlHandler  =  require('./mysql-handler')(app, authConst);

	return {
	};
};