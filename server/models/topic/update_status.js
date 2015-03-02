/**
 * [update user topic status]
 * @param  {[Array]}  values   [array containing user_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(values, db, callback){

  if (values[0] === 'enqueue' || 'reviewed' || 'completed' ){

    //query topic update and send response message
    db.client.query(query.topic.update.status, values, function(err){
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