var regex      = require('../../helpers/RegexFunctions.js');
var response   = require('../../helpers/Response.js')
var auth       = require('../../helpers/Auth.js');
var user_level = require('../../models/user/user_level.js')
var code  = 'CUUUL';
var values, user;

module.exports = (function(req, res, db){
//check if users are logged in and at an appropriate user_level
  if ( auth.check_login(req.session.user, 10) ) {

    //check if user level user id and set level was sent
    if (req.body.user.user_level && req.body.user.user_id && req.body.level ){

      //sanitize script tags from inputs
      values = regex.sanitizeForm([req.body.level, req.body.user.user_id]);
      user   = regex.sanitizeForm([req.body.user.name]);

      //validate user_level and user_id are numbers
      if (regex.isNumber(values[0]) && regex.isNumber(values[1])){

        //admin function to change a users user_level to and from admin returns result message
        user_level(values, user, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, code + '0104');
        });

      } else {
        response.error_generic(res, code + '0103', 'invalid', 400);
      }
    } else {
      //missing required info
      response.error_generic(res, code + '0102', 'missing', 400);
    }
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});
