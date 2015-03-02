/**
 * [get all users id, name email user_level and graduation]
 * @param  {[Array]}  values   [array containing user_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to AdminController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(values, db, callback){

  db.client.query(query.user.select.all_users, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MAGU0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});