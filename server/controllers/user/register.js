var fs         = require('fs');
var path       = require('path');
var response   = require('../../helpers/Response.js');
var regex      = require('../../helpers/RegexFunctions.js');
var register   = require('../../models/user/register.js');
var update_pic = require('../../models/user/update_profile_pic.js');
var page_code  = 'CUR';
var file, form, graduation_date, user, pic_file, user_id, user_dir, file_path, file_name;

module.exports = (function(req, res, db){

  //set variables
  file = req.files.pic;
  form = req.body;
  //check for name, email, password, confirm, location, month, and year are in form
  if( form.name && form.email && form.password && form.confirm && form.location && form.month && form.year ) {

    //place form elements into an array for model
    user = [ form.name, form.email.toLowerCase(), form.location, form.password, form.month, form.year, form.confirm];

    //remove any script tags
    user = regex.sanitizeForm(user);

    //check each form element is in the correct format
    if (   regex.isString(  user[0])   //name
        && regex.isEmail(   user[1])    //email
        && regex.isString(  user[2])   //location
        && regex.isPassword(user[3]) //password
        && regex.isNumber(  user[4])   //month
        && regex.isNumber(  user[5])   //year
        && user[3] === user[6]       //password matches confirm
      )
    {
      //place year and month to make date a valid datetime
      graduation_date = "20" + user[5] + "-" + user[4] + "-01 00:00:00";

      //delete last 3 array elements and insert graduation datetime
      user.splice(4, 3, graduation_date);

      //register user set session data and return rootscope data or error message
      register(user, db, function(has_err, data){
        if (!has_err){
          user_id = data;
          user_dir = __dirname + "/../../../client/assets/users/" + user_id;

          //make user's sub folders
          fs.mkdirSync(user_dir);
          fs.mkdirSync(user_dir + "/profile/" );

          //if user uploaded a pic
          if (file !== undefined){

            //read file from temp folder and update user's profile
            fs.readFile(file.path, function(err, data){
              if (err) throw err;
              //file name and path
              file_name = user_id + "_" + Date.now()  + path.extname(file.originalname);
              file_path = user_dir + "/profile/" + file_name;

              //copy file from temp folder and place in user's profile folder
              fs.writeFile(file_path, data, function(has_err){
                if(has_err) throw err
                //update database of user's profile pic
                update_pic([file_name, user_id], db, function(has_err, data){
                  if (has_err){
                    response.error_data(res, data, page_code + '0104');
                  }
                  //delete temp file
                  fs.unlinkSync(file.path)
                });
              });
            });
          }

          //set file name if defined
          pic_file = (file !== undefined ? file_name : 'anon.png');

          //set session user_id, user_level
          req.session.user = { id : user_id, user_level: 1 };

          //send rootscope graduation, pic user_level, user_id, name
          res.json({graduation: user[4], user_level: 1, user_id: data, name: user[0], file_name: pic_file}).end();
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