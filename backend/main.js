var express     =  require('express');
var bodyParser  =  require('body-parser');
var app         =  express();
	
var corsOptions = {
    origin : 'localhost'  //digital ocean server ip
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

require('./Authentication/authentication-server')(app);
require('./Admin/admin-server')(app);
require('./Signaling/signaling-server')(app);

app.listen(8080, function () {
  console.log('Listening on port 8080!');
});

