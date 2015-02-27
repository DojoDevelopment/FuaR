var login     = require('../../models/user/login.js');
var regex     = require('../../helpers/RegexFunctions.js');
var response  = require('../../helpers/Response.js');
var page_code = 'CUL';
var cred, values;
module.exports = (function(req, res, db){

    //check if email and password are in the form
    if( req.body.email && req.body.password ){

      //sanitize script tags from user form
      cred = regex.sanitizeForm([req.body.email.toLowerCase(), req.body.password]);

      //check if form is in ther correct format
      if ( regex.isEmail(cred[0]) && regex.isPassword(cred[1]) ){

        values = {email: cred[0], pass : cred[1]};

        //send form to model
        //on success set session data and return rootScope info
        //on error send message
        login(values, db, function(has_err, data){
          if ( !has_err ){
            //set session user_id, user_level
            req.session.user = {
                      id : data.user_id,
                    name : data.name,
              user_level : data.user_level,
               file_name : data.file_name
            }

            //send to rootscope the session data
            res.json(req.session.user);

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
});
