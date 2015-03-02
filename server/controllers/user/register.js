var response   = require('../../helpers/Response.js');
var regex      = require('../../helpers/RegexFunctions.js');
var register   = require('../../models/user/register.js');
var code  = 'CUR';
var file, form, graduation_date, user;

module.exports = (function(req, res, db){

  //set variables
  file = req.files.pic;
  form = req.body;
  //check for name, email, password, confirm, location, month, and year are in form
  if( form.name && form.email && form.password && form.confirm && form.location && form.month && form.year ) {

    //place form elements into an array for model
    user = [ form.name, form.email.toLowerCase(), form.location, form.password, form.month, form.year, form.confirm];

    //remove any script tags
    user = regex.sanitizeForm(user);

    //check each form element is in the correct format
    if (regex.isAlphaNumeric(user[0]) //name
        && regex.isEmail(user[1])     //email
        && regex.isString(user[2])    //location
        && regex.isPassword(user[3])  //password
        && regex.isNumber(user[4])    //month
        && regex.isNumber(user[5])    //year
        && user[3] === user[6]        //password matches confirm
      )
    {
      //place year and month to make date a valid datetime
      graduation_date = "20" + user[5] + "-" + user[4] + "-01 00:00:00";

      //delete last 3 array elements and insert graduation datetime
      user.splice(4, 3, graduation_date);

      //register user set session data and return rootscope data or error message
      register(user, file, db, function(has_err, data){
        if (!has_err){

          //set session data and return rootScope
          req.session.user = data;
          response.success(res, data);
        } else {
          //error occured during in model
          response.error_data(res, data, code + '0103');
        }
      });

    } else {
      //form is not in the correct format
      response.error_generic(res, code + '0102', 'invalid');
    }
  } else {
    //missing the status
    response.error_generic(res, code + '0101', 'missing');
  }
})