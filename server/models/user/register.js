/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing username, email, password, location, graduation date]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var fs     = require('fs');
var path   = require('path');
var bcrypt = require('bcrypt');
var query = require('../../helpers/Queries.js');
var user;
module.exports = (function(form, pic, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MUR010' + num + ': Database Error', num, query);
    callback(true, 'Oops something went wrong.');
  };

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(form[3], salt, function(err, crypted) {
      form.splice(3, 1, crypted);

      //send error or user_id
      db.client.query('BEGIN', function(err, result){
        if (err) return rollback(db.client, 1, 'BEGIN', err);

        db.client.query(query.user.select.user_count, [form[1]], function(err, results){
          if (err) return rollback(db.client, 2, query.user.select.user_count, err);
          if (results.rows[0].count === '0') {
            db.client.query(query.user.insert, form, function(err, results){
              if (err) return rollback(db.client, 3, query.user.insert, err);

              user = {
                  id  : results.rows[0].user_id
                , dir : __dirname + "/../../../client/assets/users/" + results.rows[0].user_id
                , file : { name : results.rows[0].file_name }
              };

              //make user profile folder
              fs.mkdirSync(user.dir);

              //see if user uploaded a pic
              if (pic !== undefined){

                //read file from temp folder and update user's profile
                fs.readFile(pic.path, function(err, data){
                  if (err) throw err;
                  //file name and path
                  user.file = { contents : data };
                  user.file.name = user.id + "_" + Date.now()  + path.extname(pic.originalname);
                  user.file.path = user.dir + "/" + user.file.name;

                  //copy file from temp folder and place in user's profile folder
                  fs.writeFile(user.file.path, user.file.contents, function(err){
                    fs.unlinkSync(pic.path)
                    if(err) throw err
                    db.client.query(query.user.update.pic, [user.file.name, user.id], function(err, result){
                      if (err) return rollback(db.client, 4, query.user.update.pic, err);
                    });
                  });
                });
              }
              db.client.query('COMMIT');
              callback(false, {user_id: user.id, user_level: 1, file_name: user.file.name });
            })
          } else {
            db.client.query('ROLLBACK');
            callback(true, 'That Email is already in use');
          }
        });
      });
    });
  });
});