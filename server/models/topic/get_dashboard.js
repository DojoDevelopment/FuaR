/**
 * [get all topics]
 * @param  {[Boolean]} filter   [take out private topics]
 * @param  {[Object]}  db       [object containing database]
 * @param  {Function}  callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]}  results  [object of query results]
 */
var query;
module.exports = (function(filter, db, callback){

  query = 'SELECT topics.topic_id, topics.title, users.name AS user, users.user_id, topics.description, topics.created_at, topics.updated_at, topics.views, topics.latest_version, topics.type, topics.status'
        + ' FROM topics'
        + ' LEFT JOIN users ON users.user_id = topics.user_id';
  query += (filter === true ? ' WHERE topics.is_public = TRUE' : '');

  //query for user topics dislpay message on error else return results
  db.client.query(query, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGD0101: Database Error', err);
      callback(true, 'Oops something went wrong');
    }
  })
});