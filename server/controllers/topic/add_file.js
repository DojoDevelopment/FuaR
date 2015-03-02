var path     = require('path');
var auth     = require('../../helpers/Auth.js');
var response = require('../../helpers/Response.js');
var add_file = require('../../models/topic/add_file.js');
var code = 'CTAF'
var topic = {};

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

        topic.file_path = req.files.file.path;
        topic.file_name = req.files.file.originalname;
        topic.id        = req.params.id;
        topic.key       = topic.id + '/file/' + Date.now() + path.extname(topic.file_name);
        topic.path      = 'http://v88_fuar.s3.amazonaws.com/' + topic.key;
        topic.suffix    = path.extname(topic.file_name) === '.pdf' ? 'pdf' : 'img';

        add_file(topic, db, function(has_err, data){
          !has_err ? response.success(res, data)
                   : response.error_data(res, data, code + '0104');
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