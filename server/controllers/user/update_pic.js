var fs         = require('fs');
var path       = require('path');
var auth       = require('../../helpers/Auth.js');
var response   = require('../../helpers/Response.js');
var update_pic = require('../../models/user/update_profile_pic.js');
var page_code  = 'CUUP';
var user_id, user_dir, file, file_name, file_path, old_pics, i;
//get all appropriate topics for dashboard
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ) {

    if (req.files !== undefined && req.files.pic_info instanceof Object){
      file     = req.files.pic_info;
      user_id  = req.session.user.id;
      user_dir = __dirname + "/../../../client/assets/users/" + user_id + "/profile/";
      old_pics = fs.readdirSync(user_dir);

      //read file from temp folder and update user's profile
      fs.readFile(file.path, function(err, data){
        if (err) throw err;

        //file name and path
        file_name = user_id + "_" + Date.now()  + path.extname(file.originalname);
        file_path = user_dir + file_name;

        //copy file from temp folder and place in user's profile folder
        fs.writeFile(file_path, data, function(has_err){
        if(has_err) throw err
          //update database of user's profile pic
          update_pic([file_name, user_id], db, function(has_err, data){
            //delete temp file
            fs.unlink(file.path)
            if (!has_err && old_pics.length > 0){

              //delete all old profile pics
              for (i = 0; i < old_pics.length; i++){
                  fs.unlink(user_dir + old_pics[i]);
              }
            }
            !has_err ? response.success(res, data)
                     : response.error_data(res, data, page_code + '0103');

          });//end update pic
        });//end write file
      });//end read file

    } else {
      //no file
      response.error_generic(res, page_code + '0102', 'missing');
    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});