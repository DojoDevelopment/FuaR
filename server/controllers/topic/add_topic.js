var fs        = require('fs');
var path      = require('path');
var auth      = require('../../helpers/Auth.js');
var regex     = require('../../helpers/RegexFunctions.js');
var s3        = require('../../helpers/s3.js');
var response  = require('../../helpers/Response.js');
var add_topic = require('../../models/topic/add_topic.js');
var add_file  = require('../../models/topic/add_file.js');
var page_code = 'CTAT'
var topic, topic_id, file_name, values, form, file, user_id;

//add topic to database
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    form = req.body;
    file = req.files.doc;
    user_id = req.session.user.id;

    //check if form has a title, type, and description
    if( form.title && form.type && form.about && file instanceof Object ) {
      //put form into an array for model
      topic = [ user_id, form.type, form.title, form.about];

      //remove any script tags
      topic = regex.sanitizeForm(topic);

      //check if all form data is in the correct format or send error
      if ( regex.isString(topic[1]) && regex.noWedges(topic[2]) && regex.noWedges(topic[3]) ) {
        //send query to database return message
        add_topic(topic, db, function(has_err, topic_data){
          if (!has_err){
            topic_id = topic_data;
            file_name = topic_id + '/file/' + Date.now() + path.extname(file.originalname);

            //read file from temp folder and place it in topic folder
            fs.readFile(file.path, function(err, file_data){
              if (err) throw err;
              s3.add_file(file_data, file_name, function(complete){
                fs.unlinkSync(file.path)
                if (complete){
                  add_file([topic_id, 1, file_name], db, function(has_err, data){
                    !has_err ? response.success(res)
                             : response.error_data(res, data, page_code + '0106');
                  });
                } else {
                  //error uploading to amazon
                  response.error_generic(res, page_code + '0105', 's3');
                }
              });
            });
          } else {
            //error in model
            response.error_generic(res, page_code + '0104', 'db');
          }
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