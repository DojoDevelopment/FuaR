/**
 * [Add video to database]
 * @param  {[Array]}  values   [user_id, type, title, description]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTAV010' + num + ': Database Error', num, query, err);
    callback(true, 'Oops something went wrong.');
  };

  values  = {
    videos : [obj.topic_id, obj.user_id, obj.key],
    topics : [obj.topic_id]
  }

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err, result){
    if (err) return rollback(db.client, 1, 'BEGIN', err);

    //add videos to db
    db.client.query(query.topic.insert.video, values.videos, function(err, results){
      if (err) return rollback(db.client, 2, query.topic.insert.video, err);

      //update topic status
      db.client.query(query.topic.update.video_added, values.topics, function(err, results){
        if (err) return rollback(db.client, 3, query.topic.update.video_added, err);

        //commit and send message to client
        db.client.query('COMMIT');
        callback(false, {msg: 'Response has been successfully added', key: obj.key});

      });
    });
  });
});