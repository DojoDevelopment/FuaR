var auth        = require('../../helpers/Auth.js');
var response    = require('../../helpers/Response.js')
var email       = require('../../models/user/get_email.js');
var user_topics = require('../../models/topic/user_topics.js');
var get_users   = require('../../models/admin/get_users.js')
var page_code   = 'CPS'
var eventEmitter, EventHandler, flags, user_id, results, user_level;

//get the settings page information
module.exports = (function(req, res, db){

  function check_data(res, err, data, storage, flags, key){
    flags[key] = true;
    if (!err){
      storage[key] = data;
      if(flags.email && flags.topics && flags.users) {
        response.success(res, storage);
      }
    } else {
      response.error_generic(res, page_code + '0106', 'db');
    }
  }

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    user_id      = [req.session.user.id]
    user_level   = req.session.user.user_level;
    eventEmitter = require('events').EventEmitter;
    EventHandler = new eventEmitter();
    results = {};
    flags = {
      email: false,
      topics: user_level !== 10 ? false : true,
      users: user_level === 10 ? false : true
    }

    //set listener for emails
    EventHandler.on("get_email", function() {
      //get user's email
      email(user_id, db, function(has_err, data){
        check_data(res, has_err, data, results, flags, 'email');
      });
    });

    //set listener for topics
    EventHandler.on("get_topics", function() {
      //get all topics by user
      user_topics(user_id, false, db, function(has_err, data){
        check_data(res, has_err, data, results, flags, 'topics');
      });
    });

    EventHandler.on("get_users", function(){
      get_users(user_id, db, function(has_err, data){
        check_data(res, has_err, data, results, flags, 'users');
      });
    });

    EventHandler.emit("get_email");
    user_level === 10
      ? EventHandler.emit("get_users")
      : EventHandler.emit("get_topics")

  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});