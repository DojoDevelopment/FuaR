var query = require('../../helpers/Queries.js');
module.exports = {
  get : function(values, db, callback){
  /**
   * [function to get user's email]
   * @param  {[Array]}  values   [array containing id]
   * @param  {[Object]} db       [object containing database]
   * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
   * @return {[Object]} results  [object of query results]
   */

    db.client.query(query.user.select.email_by_id, values, function(err, results){
      if (err === null){
        callback(false, results.rows[0].email);
      } else {
        console.log('ERROR MUGE0101: Database Error', err);
        callback(true, 'Oops something went wrong.');
      }
    });

  }, update : function(values, db, callback){
    /**
     * [function to update user's email]
     * @param  {[Array]}  values   [array containing new email and id]
     * @param  {[Object]} db       [object containing database]
     * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
     * @return {[Object]} results  [object of query results]
     */

    db.client.query(query.user.update.email, values, function(err){
      if (err === null){
        callback(false, 'Email has been successfully updated.');
      } else {
        console.log('ERROR MUUE0101: Database Error', err);
        callback(true, 'Oops something went wrong.');
      }
    });
  }
};