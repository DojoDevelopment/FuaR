var login     = require('../../models/user/login.js');
var regex     = require('../../helpers/RegexFunctions.js');
var response  = require('../../helpers/Response.js');
var page_code = 'CUL';
var form, cred;
module.exports = (function(req, res, db){

  //set variables
  form = req.body;

  //check if email and password are in the form
  if( form.email && form.password ){

    //sanitize script tags from user form
    cred = regex.sanitizeForm([form.email.toLowerCase(), form.password]);

    //check if form is in ther correct format
    if ( regex.isEmail(cred[0]) && regex.isPassword(cred[1]) ){

      //send form to model
      //on success set session data and return rootScope info
      //on error send message
      login(cred, db, function(has_err, data){
        if ( !has_err && data !== undefined ){
          //set session user_id, user_level
          req.session.user = {
            user_level : data.user_level,
                    id : data.user_id
          }
          //send rootscope graduation, pic file_name, user_level, user_id, name
          res.json({
            graduation : data.graduation,
             file_name : data.file_name,
            user_level : data.user_level,
                    id : data.user_id,
                  name : data.name
          });

        } else if (!has_err && data === undefined ){
          //password doesn't match
          response.error_generic(res, page_code + '0104', 'password');

        } else {
          //error occured during in model
          response.error_data(res, data, page_code + '0103');

        }
      });
    } else {
      //form is not in the correct format
      response.error_generic(res, page_code + '0102', 'invalid');

    }
  } else {
    //missing the status
    response.error_generic(res, page_code + '0101', 'missing');

  }
})