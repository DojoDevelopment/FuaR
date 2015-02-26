/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing email and password]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var bcrypt = require('bcrypt');
var query, info;
module.exports = (function(form, db, callback){

  query = 'SELECT user_id, password, name, user_level, graduation, file_name'
        + ' FROM users'
        + ' WHERE email = $1';

  db.client.query(query, [form.email], function(err, res){

    if (res.rows[0]){
      bcrypt.compare(form.pass, res.rows[0].password, function(err, test){

        if (test){
          info = {
            graduation : res.rows[0].graduation,
             file_name : res.rows[0].file_name,
            user_level : res.rows[0].user_level,
               user_id : res.rows[0].user_id,
                  name : res.rows[0].name
          }
          callback(false, info);

        } else {
          console.log('ERROR MUL0102: Password does not match.');
          callback(true, 'Password does not match.');

        }
      });
    } else {
      console.log('ERROR MUL0101: Email not found in Database.');
      callback(true, 'Email not found in Database.');

    }
  });
});