// set up the express app
var pg_connect = require('./config/db_config.js');
var session    = require('express-session');
var bodyParser = require('body-parser');
var express    = require('express');
var multer     = require('multer');
var morgan     = require('morgan');
var path       = require('path');
var app        = express();

// all environments
app.set('port', process.env.PORT || 3000);

// point the express app to the static files folder so it can set up a static file server
app.use(express.static(path.join(__dirname, 'client')));
app.use(
  session({
      secret : 'qwerty'
    , resave : false
    , saveUninitialized: true
  })
);

//check for csrf
//app.use(csrf());

app.use(morgan('dev'));

// body parse allows us to use req.body and get post data
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

app.use(
  multer({
    dest: './temp_uploads/'
    , limits: { files : 1 }
    , onFilesLimit: function () { console.log('Crossed file limit!') }
  })
);

// connect to pg using our custom made connector function from db_config
pg_connect(function(db) {
  // checks for our db stuff
  console.log('db connected: ' + db.connected/*, db.client*/);
  //require routes
  require('./server/routes.js')(app, db);
  // TELL THE SERVER TO LISTEN
  // listen
  app.listen(3000, function() { console.log("localhost:3000") })
});