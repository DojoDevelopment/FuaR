// set up the express app
var express = require('express')
 ,  session = require('express-session')
 ,   multer = require('multer')
 ,     path = require('path')
 ,      app = express();

// all environments
app.set('port', process.env.PORT || 3000);

// point the express app to the static files folder so it can set up a static file server
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
  secret: 'qwerty',
  resave: false,
  saveUninitialized: true
}))

// HTTP request logger
var morgan = require('morgan')
app.use(morgan('dev'));

// body parse allows us to use req.body and get post data
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

app.use(multer({
	dest: './temp_uploads/'
	, limits: {
		files : 1
	}, onFilesLimit: function () {
	  console.log('Crossed file limit!')
	}
}));

var pg_connect = require('./config/db_config.js');

// connect to pg using our custom made connector function from db_config
pg_connect(function(db) {
	// checks for our db stuff
	console.log('db connected: ' + db.connected/*, db.client*/);
	//require routes
	require('./server/routes.js')(app, db);
    // TELL THE SERVER TO LISTEN
	// listen
	app.listen(3000, function() { console.log("port 3000 is open for business") })
})

