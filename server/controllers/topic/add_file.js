var fs       = require('fs');
var path     = require('path');
var s3       = require('../../helpers/s3.js');
var auth     = require('../../helpers/Auth.js');
var response = require('../../helpers/Response.js');
var add_file_to_db = require('../../models/topic/add_file.js');
var page_code = 'CTAF'
var file, topic_id, file_name;

module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {
    //cehck if paramaters are numbers
    if ( auth.check_params(req.params.id) ) {
      //check for user id is there
      if( req.files instanceof Object && (
           path.extname(req.files.file.originalname) === '.pdf'
        || path.extname(req.files.file.originalname) === '.png'
        || path.extname(req.files.file.originalname) === '.jpg'
      )) {

        file      = req.files.file;
        topic_id  = req.params.id;
        file_name = 'http://v88_fuar.s3.amazonaws.com/' + topic_id + '/file/' + Date.now() + path.extname(file.originalname);

        //place values into an array for database
        fs.readFile(file.path, function(err, data){
          if (err) throw err;

          s3.add_file(data, file_name, function(complete){
            if (complete){

              values = {
                id : topic_id,
                key : file_name
              }

              add_file_to_db(values, db, function(has_err, data){

                if (!has_err) {
                  //delete temp file
                  fs.unlinkSync(file.path)

                  !has_err ? response.success(res, data)
                           : response.error_data(res, data, page_code + '0106');

                } else {
                  //error in add file0 model
                  response.error_generic(res, page_code + '0105', 'db');
                }

              });

            } else {
              //error uploading to amazon
              response.error_generic(res, page_code + '0104', 's3');
            }

          });
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