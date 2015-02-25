/**
 * [updates user public settings]
 * @param  {[Array]}  values  [array containing user_id]
 * @param  {[Object]} db      [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'UPDATE topics SET is_public = $1'
        + ' WHERE topic_id = $2';

  //query topic update and send response message
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, 'This topic is now ' + ( values[0] == 'true' ? 'public.' : 'private.' ));
    } else {
      console.log('ERROR MTUP0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  })
});