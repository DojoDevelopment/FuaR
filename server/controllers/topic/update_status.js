var auth          = require('../../helpers/Auth.js');
var response      = require('../../helpers/Response.js');
var update_status = require('../../models/topic/update_status.js');
var code     = 'CTUS'
var form;
module.exports = (function(req, res, db){

  //check if user has a user_level of at least 1 and params are a number
  if ( auth.check_login(req.session.user, 5) ) {
    if ( auth.check_params(req.params.id) ) {
      if ( req.body.status !== undefined ){
          //set array for model
          form = [req.body.status, req.params.id];

          //update privacy return success or error message
          update_status(form, db, function(has_err, data){
              !has_err ? response.success(res, data)
                       : response.error_data(res, data, code + '0104');
          });
      } else {
        //missing the status
        response.error_generic(res, code + '0103', 'missing');
      }
    } else {
      //params are not numbers
      response.error_generic(res, code + '0102', 'params');
    }
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});