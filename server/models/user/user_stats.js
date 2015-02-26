/**
 * [function to update user's email]
 * @param  {[Array]}  values   [array containing new email and id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT name, file_name, graduation, location'
        + ' FROM udsers'
        + ' WHERE user_id = $1';

  //send error or user_id
  db.client.query(query, [values], function(err, res){
    if (err === null){
      callback(false, res.rows[0]);
    } else {
      console.log('ERROR MUUS0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});