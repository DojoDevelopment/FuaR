/**
 * [get topic files]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(values, db, callback){

  //query for user topics dislpay message on error else return results
  db.client.query(query.topic.select.files, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGF0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  });
});