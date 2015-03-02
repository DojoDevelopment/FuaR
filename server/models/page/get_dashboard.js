/**
 * [get all topics]
 * @param  {[Boolean]} filter   [take out private topics]
 * @param  {[Object]}  db       [object containing database]
 * @param  {Function}  callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]}  results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(filter, db, callback){

  //query for user topics dislpay message on error else return results
  db.client.query(query.page.dashboard(filter), function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGD0101: Database Error', err);
      callback(true, 'Oops something went wrong');
    }
  })
});