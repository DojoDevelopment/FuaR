/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing email and password]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var bcrypt = require('bcrypt');
var query  = require('../../helpers/Queries.js');
var info;
module.exports = (function(form, db, callback){

  db.client.query(query.user.select.login, [form.email], function(err, res){

    if (res.rows[0]){
      bcrypt.compare(form.pass, res.rows[0].password, function(err, test){

        if (test){
          info = {
             user_level : res.rows[0].user_level
            ,   user_id : res.rows[0].user_id
            , file_name : res.rows[0].file_name
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