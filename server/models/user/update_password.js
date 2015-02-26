/**
 * [function to update user's password]
 * @param  {[Array]}  values   [array containing new password and id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'UPDATE users'
        + ' SET password = $1'
        + ' WHERE user_id = $2';

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