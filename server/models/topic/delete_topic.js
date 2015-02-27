/**
 * [Delete Topic from database]
 * @param  {[Array]}  values   [topic_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var s3 = require('../../helpers/s3.js');
var query, topic_user;
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTDT010' + num + ': Database Error', num, query);
    callback(true, 'Oops something went wrong.');
  };

  query = [];
  query.push('SELECT user_id FROM topics WHERE topic_id = $1');
  query.push('DELETE FROM topics WHERE topic_id = $1');
  values = { get : [obj.topic_id] };

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err, result){
    if (err) return rollback(db.client, 1, 'BEGIN', err);

    db.client.query(query[0], values.get, function(err,results){
      if (err) return rollback(db.client, 2, query[0], err);
      topic_user = results.rows[0].user_id;

      if (obj.user_level >= 5 || obj.user_id === topic_user){
        s3.delete_topic(obj.topic_id);
        db.client.query(query[1], obj.topic_id, function(err, data){
          if (!err){
            db.client.query('COMMIT');
            callback(false, 'Topic has been succssfully deleted.');
          } else {
            callback(true, 'Oops something went wrong.');
          }
        });
      }

// if (err === null){
        //   callback(false, "topic " + value[0] + " has been permanently deleted");
        // } else {
        //   console.log('ERROR MTDT0101: Database Error', err);
        //   callback(true, 'Oops something has gone wrong.');
        // }
    });
  });

});