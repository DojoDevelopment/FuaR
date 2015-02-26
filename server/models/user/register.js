/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing username, email, password, location, graduation date]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'INSERT INTO users(name, email, location, password, graduation)'
        + ' VALUES ($1, $2, $3, $4, $5)'
        + ' RETURNING user_id';

  //send error or user_id
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0].user_id);
    } else {
      console.log('ERROR MUR0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});