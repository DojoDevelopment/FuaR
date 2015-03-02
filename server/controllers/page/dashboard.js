var auth      = require('../../helpers/Auth.js');
var response  = require('../../helpers/Response.js')
var dashboard = require('../../models/page/get_dashboard.js');
var code = 'CPD';
var filter;
//get all appropriate topics for dashboard
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    //if user_level is less than 5 filter private results
    filter = (req.session.user.user_level < 5 ? true : false );

    //get topics for dashboard
    dashboard(filter, db, function(has_err, data){
      !has_err ? response.success(res, data)
               : response.error_data(res, data, code + '0102');
    });
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});