var auth      = require('../../helpers/Auth.js');
var response  = require('../../helpers/Response.js')
var topics    = require('../../models/topic/user_topics.js');
var user      = require('../../models/user/user_stats.js');
var page_code = 'CPP';
var values, filter;
//all topics by user id
module.exports = (function(req, res, db){

  function check_data(res, err, data, storage, flags, key){
    flags[key] = true;
    if (!err){
      storage[key] = data;
      if (flags.topics && flags.user) {
        response.success(res, storage);

      }
    } else {
      response.error_generic(res, page_code + '0103', 'db');
    }
  }

  //check if user is logged in and params are a number
  if ( auth.check_login(req.session.user, 1) ) {
    if ( auth.check_params(req.params.id) ) {

      eventEmitter = require('events').EventEmitter;
      EventHandler = new eventEmitter();
      flags = {topics: false, user: false}
      page  = {    id: req.params.id }

      //set listener for comments
      EventHandler.on("get_topics", function() {
        //filter if user isn't same as the page id or if user isn't admin
        filter = (req.session.user.id == page.id || req.session.user.user_level >= 5 ? false : true );
        //query database for comments set comment flag as true
        topics(page.id, filter, db, function(has_err, data){
          check_data(res, has_err, data, page, flags, 'topics')
        });
      });

      EventHandler.on('get_user', function(){
        user(page.id, db, function(has_err, data){
          check_data(res, has_err, data, page, flags, 'user')
        });
      });

      EventHandler.emit("get_topics");
      EventHandler.emit("get_user");

    } else {
      //params are not numbers
      response.error_generic(res, page_code + '0102', 'params');
    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});