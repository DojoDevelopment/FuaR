/**
 * [get all topics by the page users id]
 * @param  {[Array]}   values   [array containing user_id]
 * @param  {[Boolean]} filter   [is user allowed to see all user content]
 * @param  {[Object]}  db       [object containing database]
 * @param  {Function}  callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]}  results  [object of query results]
 */
var query
module.exports = (function(values, filter, db, callback){

  query = 'SELECT topics.topic_id, topics.title, topics.description, topics.views, topics.type, topics.latest_version, topics.is_public, topics.created_at, topics.status, topics.updated_at, count(videos) AS videos, count(posts) AS posts'
        +  ' FROM topics'
        +  ' LEFT JOIN videos ON videos.topic_id = topics.topic_id'
        +  ' LEFT JOIN posts ON posts.topic_id = topics.topic_id'
        +  ' WHERE topics.user_id = $1';
  query +=  ( filter === true ? ' AND topics.is_public = TRUE' : '');
  query += ' GROUP BY topics.topic_id, topics.title, topics.description, topics.created_at, topics.updated_at, topics.views, topics.latest_version';
  query += ' ORDER BY topics.topic_id';

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTUT0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  })
});