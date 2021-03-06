/**
 * [Delete Topic from database]
 * @param  {[Ojbect]} obj      [topic_id, user_id, user_level]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var s3    = require('../../helpers/s3.js');
var query = require('../../helpers/Queries.js');
var rollback, topic_user;
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTDT010' + num + ': Database Error', query, err);
    callback(true, 'Oops something went wrong.');
  };

  values = { get : [obj.topic_id] };

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err, result){
    if (err) return rollback(db.client, 1, 'BEGIN', err);

    db.client.query(query.user.select.user_id_from_topic, values.get, function(err,results){
      if (err) return rollback(db.client, 2, query.user.select.user_id_from_topic, err);
      topic_user = results.rows[0].user_id;

      if (obj.user_level >= 5 || obj.user_id === topic_user){
        s3.delete_topic(obj.topic_id);
        db.client.query(query.topic.delete.topic, values.get, function(err){
          if (err) return rollback(db.client, 3, query.topic.delete.topic, err);
          db.client.query('COMMIT');
          callback(false, 'Topic has been succssfully deleted.');
        });
      }
    });
  });

});