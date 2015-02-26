var regex           = require('../../helpers/RegexFunctions.js');
var auth            = require('../../helpers/Auth.js');
var response        = require('../../helpers/Response.js');
var update_password = require('../../models/user/update_password.js');
var page_code       = 'CUUP';
var values, form;

//get all appropriate topics for dashboard
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    form = req.body;

    if (form.password !== undefined && form.confirm !== undefined) {

      form = regex.sanitizeForm(form);
      values = [form.password, req.session.user.id, form.confirm];

      if (regex.isPassword(values[0]) && regex.isPassword(values[2])){
        if (values[0] === values[2]) {

          values.splice(2,1);
          update_password(values, db, function(has_err, data){
            !has_err ? response.success(res, data)
                     : response.error_data(res, data, page_code + '0105');
          });

        } else {
          //password and confirm do not match
          response.error(res, page_code + '0104', 400, 'Password & confirm do not match')

        }
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
