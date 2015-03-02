/**
 * [Add file to database]
 * @param  {[Object]} values   [id, file, key, path, suffix]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
var s3    = require('../../helpers/s3.js');
var fs    = require('fs');
var code  = 'MTAF'
var args = {};
var rollback;
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, arg, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR ' + code + '010' + num + ': Database Error', num, query, arg, err);
    callback(true, 'Oops something went wrong.');
  };

  args.post   = [obj.id, obj.path, obj.suffix];
  args.update = [obj.id];

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err){

    //insert file info into database
    db.client.query(query.topic.insert.file, args.post, function(err, res){
      if (err) return rollback(db.client, 1, query.topic.insert.file, args.post, err);

      //update topics latest version
      db.client.query(query.topic.update.version, args.update, function(err, res){
        if (err) return rollback(db.client, 2, query.topic.update.latest_version, args.update, err);

        fs.readFile(obj.file_path, function(err, file_data){
          if (err) throw err;

          //add to s3, delete temp file, send path and message to user, or rollback
          s3.add_file(file_data, obj.key, function(complete){
            if (complete){
              fs.unlinkSync(obj.file_path)
              db.client.query('COMMIT');
              callback(false, {msg: 'Revision has been successfully added', key: obj.path, type: obj.suffix});
            } else {
              //error uploading to amazon
              return rollback(db.client, 3, 's3', obj.key, err);
            }
          });
        });
      });
    });
  });
});