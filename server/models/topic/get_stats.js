/**
 * [get topic information]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(id, db, callback){

  query = 'SELECT user_id, is_public, views, status, description'
        + ' FROM topics'
        + ' WHERE topic_id = $1';

  values = [id];

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0]);
    } else {
      console.log('ERROR MTGS0101: Database Error', err);
      callback(true, 'Oops something went wrong');
    }
  });
});