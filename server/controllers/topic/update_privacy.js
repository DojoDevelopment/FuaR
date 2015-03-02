var auth     = require('../../helpers/Auth.js');
var response = require('../../helpers/Response.js');
var privacy  = require('../../models/topic/update_privacy.js');
var stats    = require('../../models/topic/get_stats.js');
var code = 'CTUP'
module.exports = (function(req, res, db){

  //check if user has a user_level of at least 1 and params are a number
  if ( auth.check_login(req.session.user, 1) ){
    if ( auth.check_params(req.params.id) ) {
      //get topic user_id and public state
      stats(req.params.id, db, function(has_err, data){
        //if no errors
        if ( !has_err ){
          //check if user is the creator of the topic or if the user is admin
          if (data.user_id === req.session.user.user_id || req.session.user.user_level >= 5){

            //switch public states
            is_public = (data.is_public === false ? true : false);
            //set array for model
            var form = [is_public, req.params.id];

            //update privacy return success or error message
            privacy(form, db, function(has_err, data){
              !has_err ? response.success(res, data)
                       : response.error_data(res, data, code + '0105');
            });

          } else {
            //user is not creator or admin
            response.error_generic(res, code + '0104', 'access');
          }
        } else {
          //error posted in model
          response.error_data(res, data, code + '0103');
        }
      });
    } else {
      //params are not numbers
      response.error_generic(res, code + '0102', 'params');
    }
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});