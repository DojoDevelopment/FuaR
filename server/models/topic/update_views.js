/**
 * [update views of topic]
 * @param  {[Array]}  values   [array containing topic_id]
 * @param  {[Object]} db       [object containing database]
 */
var query, values, veiws, rollback;
module.exports = (function(id, db){

  rollback = function(client, num, query, err) {
    db.client.query('ROLLBACK', function() {
      client.end();
    });
    console.log('ERROR MTUV010' + num + ': Database Error', num, query, err);
  };


  query    = [];
  query[0] = 'SELECT views FROM topics WHERE topic_id = $1';
  query[1] = 'UPDATE topics SET views = $1 WHERE topic_id = $2';

  values = {get: [id]}

  //preforms all db queries as a transaction roll back if any fail
  db.client.query('BEGIN', function(err){
    if (err) return rollback(db.client, 1, 'BEGIN');

    //get number of views
    db.client.query(query[0], values.get, function(err, data){
      if (err) return rollback(db.client, 1, query[0], err);
      views = Number(data.rows[0].views) + 1;
      values.update = [views, id];

      //update number of views
      db.client.query(query[1], values.update, function(err){
        if (err) return rollback(db.client, 2, query[1], err);
        db.client.query('COMMIT');
      })
    });
  });


});