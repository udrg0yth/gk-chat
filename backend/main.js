var express    			=  require('express'),
	bodyParser 			=  require('body-parser'),
	application         =  express(),
	genericConstants 	= require('./genericConstants')();

var corsOptions = {
    origin : 'localhost' 
}

application.use(bodyParser.json());
application.use(bodyParser.urlencoded({
    extended : true
}));

require('./authentication/authentication-server')(application, genericConstants);

application.listen(8080, function () {
  console.log('Listening on port 8080!');
});

