/**
 * [get topic files]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT files.file_id, files.version, files.key, files.created_at'
        + ' FROM files'
        + ' WHERE topic_id = $1'
        + ' ORDER BY files.version';

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGF0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  });
});