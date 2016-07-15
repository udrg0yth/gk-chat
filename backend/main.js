var express    			=  require('express'),
	bodyParser 			=  require('body-parser'),
	application         =  express(),
	genericConstants 	= require('./generic-constants')(),
	tokenHandler 		= require('./token-handler')(application, genericConstants),
	mysql      			= require('promise-mysql');

var corsOptions = {
    origin : 'localhost' 
}

mysql.createConnection(genericConstants.MYSQL_SOURCE)
.then(function(connection){
	var authMysqlHandler    = require('./mysql-handlers/authentication-mysql-handler')(genericConstants, connection),
		persMysqlHandler    = require('./mysql-handlers/personality-mysql-handler')(genericConstants, connection),
		gkMysqlHandler		= require('./mysql-handlers/gk-mysql-handler')(genericConstants, connection),
		intelMysqlHandler	= require('./mysql-handlers/intel-mysql-handler')(genericConstants, connection);
		
	    require('./authentication/authentication-server')(application, 
			genericConstants, tokenHandler, authMysqlHandler);
		require('./personality/personality-server')(application, genericConstants, tokenHandler, persMysqlHandler);
});

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended : true
}));



application.listen(8080, function () {
  console.log('Listening on port 8080!');
});

