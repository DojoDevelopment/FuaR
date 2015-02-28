/**
 * [function to update user's password]
 * @param  {[Array]}  values   [array containing new password and id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var bcrypt = require('bcrypt');
var query;
module.exports = (function(values, db, callback){

  query = 'UPDATE users'
        + ' SET password = $1'
        + ' WHERE user_id = $2';

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(values[0], salt, function(err, crypted) {
      values.splice(0, 1, crypted);
      //send error or user_id
      db.client.query(query, values, function(err){
        if (err === null){
          callback(false, 'Password has been successfully updated.');
        } else {
          console.log('ERROR MUUP0101: Database Error', err);
          callback(true, 'Oops something went wrong.');
        }
      });
    });
  });
});