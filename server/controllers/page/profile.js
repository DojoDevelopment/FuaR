var auth     = require('../../helpers/Auth.js');
var response = require('../../helpers/Response.js')
var topics   = require('../../models/topic/user_topics.js');
var page_code = 'CPP';
var values, filter;
//all topics by user id
module.exports = (function(req, res, db){

  //check if user is logged in and params are a number
  if ( auth.check_login(req.session.user, 1) ) {
    if ( auth.check_params(req.params.id) ) {

      //set user id for model
      values = [req.params.id];

      //filter if user isn't same as the page id or if user isn't admin
      filter = (req.session.user.id == values[0] || req.session.user.user_level >= 5 ? false : true );

      //get all topics by user id else send error to user
      topics(values, filter, db, function(has_err, data){
        !has_err
          ? response.success(res, data)
          : response.error_data(res, data, page_code + '0103');
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