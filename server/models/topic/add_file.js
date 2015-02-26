/**
 * [Add file to database]
 * @param  {[Array]}  values   [user_id, type, title, description]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query, rollback, topic_id, version;
module.exports = (function(obj, db, callback){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTAF010' + num + ': Database Error', num, query);
    callback(true, 'Oops something went wrong.');
  };

  query = [];
  query[0] = 'SELECT latest_version'
           + ' FROM topics'
           + ' WHERE topic_id = $1';

  query[1] = 'INSERT INTO files (topic_id, version, key)'
           + ' VALUES ($1, $2, $3)';

  query[2] = 'UPDATE topics'
           + ' set latest_version = $1,'
           + " status = 'enqueue'"
           + ' WHERE topic_id = $2';

  values = {
    get : [obj.id]
  }

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err, result){
    if (err) return rollback(db.client, 1, 'BEGIN', err);

    //get the latest version of the topic
    db.client.query(query[0], values.get, function(err, res){
      if (err) return rollback(db.client, 2, query[0], err);
      version = Number(res.rows[0].latest_version) + 1;
      values.post = [obj.id, version, obj.key]

      //insert file info into database
      db.client.query(query[1], values.post, function(err, res){
        if (err) return rollback(db.client, 3, query[1], err);
        values.update = [version, obj.id];

        //update topics latest version
        db.client.query(query[2], values.update, function(err, res){
          if (err) return rollback(db.client, 4, query[2], err);

          //commit and send message to client
          db.client.query('COMMIT');
          callback(false, {msg: 'Revision has been successfully added', key: obj.key});
        });
      });
    });
  });
});