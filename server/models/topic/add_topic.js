/**
 * [Add topic to database]
 * @param  {[Object]} values   [user_id, type, title, about, file]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object with err status and message]
 */
var fs    = require('fs');
var path  = require('path');
var s3    = require('../../helpers/s3.js');
var query = require('../../helpers/Queries.js');
var code  = 'MTAT'
var args  = {};
var rollback;
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, arg, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR ' + code + '010' + num + ': Database Error', num, query, arg, err);
    callback(true, 'Oops something went wrong.');
  };

  args.topic = [obj.user_id, obj.type, obj.title, obj.about];

  //  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err){

    //query for user topics dislpay message on error else return results
    db.client.query(query.topic.insert.topic, args.topic, function(err, results){
      if (err) return rollback(db.client, 2, query.topic.insert.topic, args.topic, err);
      args.data = {};
      args.data.id   = results.rows[0].topic_id
      args.data.key  = args.data.id + '/file/' + Date.now() + path.extname(obj.file_name);
      args.data.path = 'http://v88_fuar.s3.amazonaws.com/' + args.data.key;

      args.file = [args.data.id, args.data.path, obj.suffix];

      //add file to db
      db.client.query(query.topic.insert.file, args.file, function(err, results){
        if (err) return rollback(db.client, 4, query.topic.insert.file, args.file, err);
        //read file in temp folder
        fs.readFile(obj.file_path, function(err, file_data){
          if (err) return rollback(db.client, 3, 'reading file err', err);

          //add file to s3 and delete temp file
          s3.add_file(file_data, args.data.key, function(complete){
            fs.unlinkSync(obj.file_path);
            if (complete){
              db.client.query('COMMIT');
              callback(false, 'Topic has been added successfully.');
            } else {
              return rollback(db.client, 3, 's3', obj.key, err);
            }
          });
        });
      });
    });
  });
});