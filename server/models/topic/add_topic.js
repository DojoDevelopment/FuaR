/**
 * [Add topic to database]
 * @param  {[Array]}  values   [user_id, type, title, description]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var fs   = require('fs');
var path = require('path');
var s3   = require('../../helpers/s3.js');
var query, rollback, topic_id, key;
module.exports = (function(values, file, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTAF010' + num + ': Database Error', num, query);
    callback(true, 'Oops something went wrong.');
  };

  query = [];
  query.push('BEGIN');
  query.push('INSERT INTO topics (user_id, type, title, description) VALUES ($1, $2, $3, $4) RETURNING topic_id');
  query.push('INSERT INTO files (topic_id, key) VALUES ($1, $2)');
  query.push('COMMIT');

  //  //preforms all db queries as a transaction roll back if any fail
  db.client.query(query[0], function(err, result){
    if (err) return rollback(db.client, 1, query[0], err);
    //query for user topics dislpay message on error else return results
    db.client.query(query[1], values, function(err, results){
      if (err) return rollback(db.client, 2, query[1], err);
      topic_id = results.rows[0].topic_id
      key      = 'http://v88_fuar.s3.amazonaws.com/' + topic_id + '/file/' + Date.now() + path.extname(file.originalname);
      values   = [topic_id, key];

      db.client.query(query[2], values, function(err, results){
        if (err) return rollback(db.client, 3, query[2], err);

        fs.readFile(file.path, function(err, file_data){
          if (err) return rollback(db.client, 4, 's3', err);
          s3.add_file(file_data, key, function(complete){
            fs.unlinkSync(file.path)
            if (complete){
              db.client.query('COMMIT');
              callback(false, 'Topic has been added successfully.');
            } else {
              //error uploading to amazon
              callback(true, 'Failed to send to s3.');
            }
          });
        });
      })
    });
  });
});