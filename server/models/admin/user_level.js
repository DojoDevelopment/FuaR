/**
 * [update users user_level]
 * @param  {[Array]}  values   [array containing user_level & user_id]
 * @param  {[Array]}  user     [array containing user name]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to AdminController.js ([boolean] has_err, [obj/boolean] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, user, db, callback){

  query = 'UPDATE users'
        + ' SET user_level = $1'
        + ' WHERE user_id = $2';

  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, user[0] +' has been updated to '+ (values[0] == '1' ? 'user.' : 'admin.'));
    } else {
      console.log('ERROR MAUL0101: Database Error', err);
      callback(true, 'Oops something went wrong');
    }
  });
});