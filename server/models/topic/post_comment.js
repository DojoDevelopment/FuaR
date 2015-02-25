/**
 * [post a comments]
 * @param  {[Array]}  values   [topic_id, user_id, post, parent_id]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query;
module.exports = (function(values, db, callback){

  //check if comment is a post or a comment
  if( values[3] !== '0') { //comment
    query = "INSERT INTO posts(topic_id, user_id, post, parent_id) VALUES ($1, $2, $3, $4)";
  } else {//post
    //delete parent_id from array
    values.splice(3,1);
    query = "INSERT INTO posts(topic_id, user_id, post) VALUES ($1, $2, $3)";
  }
  query += " RETURNING post_id";

  //query for user topics dislpay message on error else return results
  db.client.query(query, values, function(err, results){
    if (err === null){
      callback(false, results.rows[0]);
    } else {
      console.log('ERROR MTPC0101: Database Error', err);
      callback(true, 'Oops something has gone wrong.');
    }
  });
});