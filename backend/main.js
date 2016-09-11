var express    			=  require('express'),
	bodyParser 			=  require('body-parser'),
	application         =  express(),
	fs 					=  require('fs'),
	https 				=  require('https'),
	constantValues		=  require('./constant-values')(),
	genericConstants 	=  require('./generic-constants')(constantValues),
	tokenHandler 		=  require('./token-handler')(application, genericConstants),
	mysql      			=  require('promise-mysql'),
	personalityTools    =  require('./personality/personality-tools')();

var corsOptions = {
    origin : 'localhost' 
};

mysql.createConnection(genericConstants.MYSQL_SOURCE)
.then(function(connection){
	var authMysqlHandler    = require('./mysql-handlers/authentication-mysql-handler')(genericConstants, connection),
		persMysqlHandler    = require('./mysql-handlers/personality-mysql-handler')(genericConstants, connection),
		gkMysqlHandler		= require('./mysql-handlers/gk-mysql-handler')(genericConstants, connection),
		intelMysqlHandler	= require('./mysql-handlers/intel-mysql-handler')(genericConstants, connection),
		genericTools 		= require('./generic-tools')(genericConstants);
		
	    require('./authentication/authentication-server')(application, 
			genericConstants, tokenHandler, authMysqlHandler, persMysqlHandler, intelMysqlHandler, gkMysqlHandler, genericTools, personalityTools);
		require('./personality/personality-server')(application, genericConstants, tokenHandler, persMysqlHandler, genericTools);
		require('./intelligence/intel-server')(application, genericConstants, tokenHandler, intelMysqlHandler, genericTools);
		require('./general_knowledge/gk-server')(application, genericConstants, tokenHandler, gkMysqlHandler, genericTools);
});

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended : true
}));

var options = {
    key: fs.readFileSync('C:/Clone/newkey.pem'),
    cert: fs.readFileSync('C:/Clone/cert.pem')
};


https.createServer(options, application).listen(8080, function(){
  console.log("Express server listening on port " + 8080);
});
