var express     =  require('express');
var cors        =  require('cors');
var bodyParser  =  require('body-parser');
var app         =  express();
	
var corsOptions = {
    origin : '188.166.145.225'  //digital ocean server ip
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

require('./Authentication/authentication-server')(app);

