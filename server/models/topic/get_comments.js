/**
 * [get topic comments]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  query = 'SELECT posts.post_id, posts.user_id, posts.parent_id, users.user_level, users.name, users.file_name, posts.created_at, posts.updated_at, users.graduation, posts.post'
        + ' FROM posts'
        + ' LEFT JOIN users ON posts.user_id = users.user_id'
        + ' WHERE topic_id = $1'
        + ' ORDER BY parent_id DESC, created_at ASC';

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGC0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  });
});