/**
 * [Delete Topic from database]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(value, db, callback){

  query = 'DELETE FROM topics WHERE topic_id = $1';

  db.client.query(query, value, function(err,results){
    if (err === null){
      callback(false, "topic " + value[0] + " has been permanently deleted");
    } else {
      console.log('ERROR MTDT0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  })
});