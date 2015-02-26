/**
 * [update user topic status]
 * @param  {[Array]}  values   [array containing user_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  if (values[0] === 'enqueue' || 'reviewed' || 'completed' ){
    query = 'UPDATE topics SET status = $1'
          + ' WHERE topic_id = $2';

    //query topic update and send response message
    db.client.query(query, values, function(err){
      if (err === null){
        callback(false, 'Status has been updated to ' + values[0] + '.');
      } else {
        console.log('ERROR MTUS0102: Database Error', err);
        callback(true, 'Oops something has gone wrong.');
      }
    })
  } else {
    console.log('ERROR MTUS0101: Database Error', err);
    callback(true, 'Invalid status.')
  }
});