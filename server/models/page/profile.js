/**
 * [get all topics by the page users id]
 * @param  {[Array]}   values   [array containing user_id]
 * @param  {[Boolean]} filter   [is user allowed to see all user content]
 * @param  {[Object]}  db       [object containing database]
 * @param  {Function}  callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]}  results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(id, filter, db, callback){

  //query for user topics dislpay message on error else return results
  db.client.query(query.page.profile(filter), [id], function(err, results){

    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTUT0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  })
});