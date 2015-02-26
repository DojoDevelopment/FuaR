var regex        = require('../../helpers/RegexFunctions.js');
var auth         = require('../../helpers/Auth.js');
var s3           = require('../../helpers/s3.js');
var response     = require('../../helpers/Response.js');
var delete_topic = require('../../models/topic/delete_topic.js');
var topic_stats  = require('../../models/topic/get_stats.js');
var page_code    = 'CTDT';
var user_id, topic_id, topic, eventEmitter, EventHandler, flags;

module.exports = (function(req,res,db){

  if ( auth.check_login(req.session.user, 1) ) {

    topic_id = req.params.id;
    topic_stats(topic_id, db, function(has_err, data){

      if (!has_err){
        user_id = data.user_id;

        if (user_id === req.session.user.id || req.session.user.user_level >= 5){
          s3.delete_topic(topic_id, function(complete){
            if (complete){
              delete_topic([topic_id], db, function(has_err, data){
                !has_err ? response.success(res)
                         : response.error_data(res, data, page_code + '0105');
              });
            } else {
              //error uploading to amazon
              response.error_generic(res, page_code + '0104', 's3');
            }
          })
        } else {
          //user isn't creator or admin
          response.error_generic(res, page_code + '0103', 'access');
        }
      } else {
        //db error from getting stats
        response.error_data(res, data, page_code + '0102');
      }
    })
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});