var path      = require('path');
var auth      = require('../../helpers/Auth.js');
var regex     = require('../../helpers/RegexFunctions.js');
var response  = require('../../helpers/Response.js');
var add_topic = require('../../models/topic/add_topic.js');
var code = 'CTAT'
var info;

//add topic to database
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    info = {};
    info.form = req.body;
    info.file = req.files.doc;
    info.suffix = path.extname(info.file.originalname);

    //check if form has a title, type, and description
    if( info.form.title  && info.form.type
      && info.form.about && info.file instanceof Object
      && ( info.suffix === '.pdf' || info.suffix === '.png' || info.suffix === '.jpg' )
    ){

      //check if all form data is in the correct format or send error
      if ( regex.isString(info.form.type) && regex.noWedges(info.form.title) && regex.noWedges(info.form.about) ) {

        //remove any script tags
        info.args = regex.sanitizeObj({
          user_id: req.session.user.user_id
          , type   : info.form.type
          , title  : info.form.title
          , about  : info.form.about
          , file_path : info.file.path
          , file_name : info.file.originalname
          , suffix : info.suffix === '.pdf' ? 'pdf' : 'img'
        });
        //send query to database return message
        add_topic(info.args, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, code + '0104');
        });

      } else {
        //info is not in the correct format
        response.error_generic(res, code + '0103', 'invalid');
      }
    } else {
      //missing required info
      response.error_generic(res, code + '0102', 'missing');
    }
  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});