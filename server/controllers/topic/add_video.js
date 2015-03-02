var path      = require('path');
var auth      = require('../../helpers/Auth.js');
var response  = require('../../helpers/Response.js');
var add_video = require('../../models/topic/add_video.js');
var code = 'CTAV'
var video = {};
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 5) ) {
    //check if the paramaters are numbers
    if ( auth.check_params(req.params.id) ) {
      //check for a file
      if ( req.files instanceof Object && path.extname(req.files.file.originalname) === '.mp4' ) {

        //place values into an object for database
          video.file      = req.files.file;
          video.file_path = video.file.path;
          video.file_name = video.file.originalname
          video.topic_id  = req.params.id;
          video.user_id   = req.session.user.user_id;
          video.key       = video.topic_id + '/vid/' + Date.now() + path.extname(video.file_name);;
          video.path      = "http://v88_fuar.s3.amazonaws.com/" + video.key

          add_video(video, db, function(has_err, data){
            !has_err ? response.success(res, data)
                     : response.error_data(res, data, code + '0105');
          });

      } else {
        //missing required info
        response.error_generic(res, code + '0103', 'missing');
      }

    } else {
      //params are not numbers
      response.error_generic(res, code + '0102', 'params');
    }

  } else {
    //user is not logged in
    response.error_generic(res, code + '0101', 'login', 401);
  }
});