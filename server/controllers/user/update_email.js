var regex        = require('../../helpers/RegexFunctions.js');
var auth         = require('../../helpers/Auth.js');
var response     = require('../../helpers/Response.js');
var update_email = require('../../models/user/update_email.js');
var page_code    = 'CUUE';
var form;
//get all appropriate topics for dashboard
module.exports = (function(req, res, db){

  //check if user is logged in an email address was sent
  if ( auth.check_login(req.session.user, 1)){
    if (req.body.email !== undefined ) {

      form = regex.sanitizeForm([req.body.email.toLowerCase(), req.session.user.id]);

      if (regex.isEmail){
        update_email(form, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, page_code + '0104');

        });

      } else {
        //password or confirm do not match regex
        response.error_generic(res, page_code + '0103', 'invalid');

      }
    } else {
      //missing password or confirm
      response.error_generic(res, page_code + '0102', 'missing');

    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);

  }
});