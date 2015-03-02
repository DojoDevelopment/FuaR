var query = require('../../helpers/Queries.js');
var comment;
var code = 'MTP'
module.exports = {

    get : function(values, db, callback){
    /**
     * [get topic comments]
     * @param  {[Array]}  values   [topic_id]
     * @param  {[Object]} db       [object containing database]
     * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
     * @return {[Object]} results  [object of query results]
     */
    db.client.query(query.topic.select.posts, values, function(err, results){
      if (err === null){
        callback(false, results.rows);
      } else {
        console.log('ERROR ' + code + '0101: Database Error', err);
        callback(true, 'Oops something has gone wrong.');
      }
    });
  }, insert : function(values, db, callback){
    /**
     * [post a comments]
     * @param  {[Array]}  values   [topic_id, user_id, post, parent_id]
     * @param  {[Object]} db       [object containing database]
     * @param  {Function} callback [function to send results to TopicController.js ([boolean] has_err, [obj/array] data)]
     * @return {[Object]} results  [object of query results]
     */

    //check if comment is a post or a comment
    if( values[3] === '0') {
      //delete parent_id from array
      values.splice(3,1);
      comment = query.topic.insert.post;
    } else {
      comment = query.topic.insert.comment;
    }

    //query for user topics dislpay message on error else return results
    db.client.query(comment, values, function(err, results){
      if (err === null){
        callback(false, results.rows[0]);
      } else {
        console.log('ERROR ' + code + '0201: Database Error', err);
        callback(true, 'Oops something has gone wrong.');
      }
    });
  }
}