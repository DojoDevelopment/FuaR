/**
 * [Add topic to database]
 * @param  {[Array]}  values   [user_id, type, title, description]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'INSERT INTO topics (user_id, type, title, description)'
        + ' VALUES ($1, $2, $3, $4) RETURNING topic_id';

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0].topic_id);
    } else {
      console.log('Error: ATM01: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});