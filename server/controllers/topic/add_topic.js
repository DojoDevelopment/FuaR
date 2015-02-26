var path      = require('path');
var auth      = require('../../helpers/Auth.js');
var regex     = require('../../helpers/RegexFunctions.js');
var response  = require('../../helpers/Response.js');
var add_topic = require('../../models/topic/add_topic.js');
var page_code = 'CTAT'
var topic, form, file, user_id, suffix;

//add topic to database
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    form = req.body;
    file = req.files.doc;
    user_id = req.session.user.id;
    suffix = path.extname(file.originalname);
    //check if form has a title, type, and description
    if( form.title && form.type && form.about && file instanceof Object
      && ( suffix === '.pdf' || suffix === '.png' || suffix === '.jpg' )){

      //remove any script tags
      topic = regex.sanitizeForm([user_id, form.type, form.title, form.about]);

      //check if all form data is in the correct format or send error
      if ( regex.isString(topic[1]) && regex.noWedges(topic[2]) && regex.noWedges(topic[3]) ) {

        //send query to database return message
        add_topic(topic, file, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, page_code + '0104');
        });
      } else {
        //info is not in the correct format
        response.error_generic(res, page_code + '0103', 'invalid');
      }
    } else {
      //missing required info
      response.error_generic(res, page_code + '0102', 'missing');
    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});