/**
 * [Add video to database]
 * @param  {[Array]}  values   [user_id, type, title, description]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var fs    = require('fs');
var s3    = require('../../helpers/s3.js');
var query = require('../../helpers/Queries.js');
var code  = 'MTAV';
var args  = {};
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, arg, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR '+ code + '010' + num + ': Database Error', num, query, err);
    callback(true, 'Oops something went wrong.');
  };

  args.insert = [obj.topic_id, obj.user_id, obj.path];
  args.update = [obj.topic_id];

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err, result){
    if (err) return rollback(db.client, 1, 'BEGIN', err);

    //add videos to db
    db.client.query(query.topic.insert.video, args.insert, function(err, results){
      if (err) return rollback(db.client, 2, query.topic.insert.video, args.insert, err);

      //update topic status
      db.client.query(query.topic.update.video, args.update, function(err, results){
        if (err) return rollback(db.client, 3, query.topic.update.video_added, args.update, err);

        fs.readFile(obj.file_path, function(err, file_data){
          if (err) throw err;

          //add to s3, delete temp file, send path and message to user, or rollback
          s3.add_file(file_data, obj.key, function(complete){
            fs.unlinkSync(obj.file_path)
            if (complete){
              db.client.query('COMMIT');
              callback(false, {msg: 'Response has been successfully added', key: obj.path});
            } else {
              return rollback(db.client, 3, 's3', obj.key, err);
            }
          })
        });
      });
    });
  });
});