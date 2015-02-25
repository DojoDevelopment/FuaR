  /**
   * [get topic videos]
   * @param  {[Array]}  values   [topic_id]
   * @param  {[Object]} db       [object containing database]
   * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
   * @return {[Object]} results  [object of query results]
   */
var query;
module.exports = (function(values, db, callback){
//videos.video_id, users.user_id, users.name, videos.created_at
  query = 'SELECT  videos.key'
        + ' FROM videos'
//        + ' LEFT JOIN users ON videos.user_id = users.user_id'
        + ' WHERE topic_id = $1'
        + ' ORDER BY video_id ASC';

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows);
    } else {
      console.log('ERROR MTGV0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  });

});