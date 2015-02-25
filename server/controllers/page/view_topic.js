var regex        = require('../../helpers/RegexFunctions.js');
var auth         = require('../../helpers/Auth.js');
var response     = require('../../helpers/Response.js');
var stats        = require('../../models/topic/get_stats.js');
var comments     = require('../../models/topic/get_comments.js');
var videos       = require('../../models/topic/get_videos.js');
var files        = require('../../models/topic/get_files.js');
var update_views = require('../../models/topic/update_views.js')
var page_code    = 'CPVT';
var topic, topic_id, eventEmitter, EventHandler, flags, key;

//get information for topic
module.exports = (function(req, res, db){

  function check_data(res, err, data, storage, flags, key){
    flags[key] = true;
    if (!err){
      storage[key] = data;
      if (flags.comments && flags.videos && flags.files) {
        if (topic.stats.user_id !== req.session.user.id){
          update_views(storage.id, db);
        }
        response.success(res, topic);

      }
    } else {
      response.error_generic(res, page_code + '0106', 'db');
    }
  }

  //check if user is logged in and params are a number
  if ( auth.check_login(req.session.user, 1) ) {
    if (auth.check_params(req.params.id) ) {

      //set result object
      topic = { id : req.params.id };

      stats(topic.id, db, function(has_err, data){
        if (!has_err && data !== undefined ) {
          topic.stats = data;
          if ( topic.stats.is_public || (req.session.user.id === topic.stats.user_id ) || (req.session.user.user_level >= 5)){
            //set emitter and handler variables and result flags
            eventEmitter = require('events').EventEmitter;
            EventHandler = new eventEmitter();
            flags = {comments: false, videos: false, files: false}

            //set listener for comments
            EventHandler.on("get_comments", function() {
              //query database for comments set comment flag as true
              comments([topic.id], db, function(has_err, data){
                check_data(res, has_err, data, topic, flags, 'comments')
              });
            });

            //set listener for videos
            EventHandler.on("get_videos", function() {
              //query database for videos set video flag as true
              videos([topic.id], db, function(has_err, data){
                check_data(res, has_err, data, topic, flags, 'videos')
              });
            });

            //set listener for files
            EventHandler.on("get_files", function() {
              //query database for files set files flag as true
              files([topic.id], db, function(has_err, data){
                check_data(res, has_err, data, topic, flags, 'files')
              });
            });

            //emit for comments videos and files
            EventHandler.emit("get_comments");
            EventHandler.emit("get_videos");
            EventHandler.emit("get_files");

          } else {
            response.error_generic(res, page_code + '0105', 'access', 401);
          }
        } else if ( !has_err && data === undefined ) {
          response.error(res, page_code + '0104', 400, 'Database returned Empty.', 'Topic Deleted or not Created')
        } else {
          response.error(res, page_code + '0103', 400, 'Topic is not found.');
        }
      });
    } else {
      //params are not numbers
      response.error_generic(res, page_code + '0102', 'params');
    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});