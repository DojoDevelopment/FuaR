var fs        = require('fs');
var path      = require('path');
var s3        = require('../../helpers/s3.js');
var auth      = require('../../helpers/Auth.js');
var response  = require('../../helpers/Response.js');
var video     = require('../../models/topic/add_video.js');
//var update_status = require('../../models/topic/update_status.js');
var page_code = 'CTAV'
var file, user_id, topic_id, file_name, values, f_name;

module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 5) ) {
    //check if the paramaters are numbers
    if ( auth.check_params(req.params.id) ) {
      //check for a file
      if ( req.files instanceof Object && path.extname(req.files.file.originalname) === '.mp4' ) {
        file      = req.files.file;
        user_id   = req.session.user.id;
        topic_id  = req.params.id;
        file_name = topic_id + '/vid/' + Date.now() + path.extname(file.originalname);

        //place values into an object for database
        values = {
          topic_id : topic_id,
          user_id : user_id,
          key : file_name
        }

        fs.readFile(file.path, function(err, file_data){
          if (err) throw err;
          s3.add_file(file_data, file_name, function(complete){
            fs.unlinkSync(file.path)
            if (complete){
              values.key = "http://v88_fuar.s3.amazonaws.com/" + file_name;
              console.log(values.key);
              video(values, db, function(has_err, data){
                !has_err ? response.success(res, data)
                         : response.error_data(res, data, page_code + '0105');
              });
            } else {
              //error uploading to amazon
              response.error_generic(res, page_code + '0104', 's3');
            }
          })
        });
      } else {
        //missing required info
        response.error_generic(res, page_code + '0103', 'missing');
      }

    } else {
      //params are not numbers
      response.error_generic(res, page_code + '0102', 'params');
    }

  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});