/**
 * [get all users id, name email user_level and graduation]
 * @param  {[Array]}  values   [array containing user_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to AdminController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT user_id, name, email, user_level, graduation'
        + ' FROM users'
        + ' WHERE user_id <> $1'
        + ' ORDER BY user_id';

  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MAGU0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});