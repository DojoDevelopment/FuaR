var regex     = require('../../helpers/RegexFunctions.js');
var auth      = require('../../helpers/Auth.js');
var response  = require('../../helpers/Response.js');
var email     = require('../../models/user/email.js');
var code = 'CUUE';
var form;
//get all appropriate topics for dashboard
module.exports = (function(req, res, db){

  //check if user is logged in an email address was sent
  if ( auth.check_login(req.session.user, 1)){
    if (req.body.email !== undefined ) {

      form = regex.sanitizeForm([req.body.email.toLowerCase(), req.session.user.user_id]);

      if (regex.isEmail){
        email.update(form, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, code + '0104');

        });

      } else {
        //password or confirm do not match regex
        response.error_generic(res, code + '0103', 'invalid');

      }
    } else {
      //missing password or confirm
      response.error_generic(res, code + '0102', 'missing');

    }
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);

  }
});