var auth         = require('../../helpers/Auth.js');
var response     = require('../../helpers/Response.js');
var delete_topic = require('../../models/topic/delete_topic.js');
var page_code    = 'CTDT';
var user_id, topic_id, topic, eventEmitter, EventHandler, flags;

module.exports = (function(req,res,db){

  if ( auth.check_login(req.session.user, 1) ) {

    obj = {
           user_id : req.session.user.id,
          topic_id : req.params.id,
        user_level : req.session.user.user_level
    }

    delete_topic(obj, db, function(has_err, data){
      !has_err ? response.success(res)
               : response.error_data(res, data, page_code + '0102');
    });

  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});