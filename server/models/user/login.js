/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing email and password]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT user_id, name, user_level, graduation, file_name'
        + ' FROM users'
        + ' WHERE email = $1'
        + ' AND password = $2';

  //send error or user_id
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0]);
    } else {
      console.log('ERROR MUL0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});