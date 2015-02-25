module.exports = function Routes(app, db) {
  //render main page
  app.get('/', function(req, res) {res.render('../../client/index');} );

  //Post Routes
  app.post('/api/users/level',      function(req, res){ require('./controllers/user/update_user_level.js')(req, res, db); });
  app.post('/api/users/login',      function(req, res){ require('./controllers/user/login.js')(req, res, db);              });
  app.post('/api/users/logout', 	  function(req, res){ require('./controllers/user/logout.js')(req, res);                 });
  app.post('/api/users/pic',        function(req, res){ require('./controllers/user/update_pic.js')(req, res, db);         });
  app.post('/api/users/password',   function(req, res){ require('./controllers/user/update_password.js')(req, res, db);    });
  app.post('/api/users/email',      function(req, res){ require('./controllers/user/update_email.js')(req, res, db);       });
  app.post('/api/users/register',   function(req, res){ require('./controllers/user/register.js')(req, res, db);           });
  app.post('/api/topics',           function(req, res){ require('./controllers/topic/add_topic.js')(req, res, db);         });
  app.post('/api/privacy/:id',      function(req, res){ require('./controllers/topic/update_privacy.js')(req, res, db);    });
  app.post('/api/comment/:id',      function(req, res){ require('./controllers/topic/add_comment.js')(req, res, db);       });
  app.post('/api/video/:id',        function(req, res){ require('./controllers/topic/add_video.js')(req, res, db);         });
  app.post('/api/file/:id',         function(req, res){ require('./controllers/topic/add_file.js')(req, res, db);          });
  app.post('/api/topic/:id/status', function(req, res){ require('./controllers/topic/update_status.js')(req, res, db);     });

  //Page Routes
  app.get( '/api/page/settings',    function(req, res){ require('./controllers/page/settings.js')(req, res, db);        });
  app.get( '/api/page/profile/:id', function(req, res){ require('./controllers/page/profile.js')(req, res, db);         });
  app.get( '/api/page/dashboard',   function(req, res){ require('./controllers/page/dashboard.js')(req, res, db);       });
  app.get( '/api/page/topic/:id',   function(req, res){ require('./controllers/page/view_topic.js')(req, res, db);      });

  //delete routes
  app.delete('/api/topics/:id',     function(req, res){ require('./controllers/topic/delete_topic')(req, res, db);      });
}

