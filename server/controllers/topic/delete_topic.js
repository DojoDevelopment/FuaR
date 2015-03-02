var auth         = require('../../helpers/Auth.js');
var response     = require('../../helpers/Response.js');
var delete_topic = require('../../models/topic/delete_topic.js');
var code    = 'CTDT';
var obj;

module.exports = (function(req,res,db){

  if ( auth.check_login(req.session.user, 1) ) {

    obj = {
        topic_id : req.params.id,
         user_id : req.session.user.user_id,
      user_level : req.session.user.user_level
    }

    delete_topic(obj, db, function(has_err, data){
      !has_err ? response.success(res, data)
               : response.error_data(res, data, code + '0102');
    });

  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});