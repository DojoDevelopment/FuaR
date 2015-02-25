/**
 * [function to get user's email]
 * @param  {[Array]}  values   [array containing id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT email'
        + ' FROM users'
        + ' WHERE user_id = $1';

  //send error or user_id
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0].email);
    } else {
      console.log('ERROR MUGE0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }

  });
});