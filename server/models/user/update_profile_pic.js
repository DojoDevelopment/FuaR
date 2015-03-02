/**
 * [function to log in user]
 * @param  {[Array]}  values   [array containing username, email, password, location, graduation date]
 * @param  {[Object]} db       [object containing database]
 * @param  {Function} callback [function to send results to UserController.js ([boolean] has_err, [obj/array] data)]
 * @return {[Object]} results  [object of query results]
 */
var query = require('../../helpers/Queries.js');
module.exports = (function(values, db, callback){

  //send error or user_id
  db.client.query(query.user.update.pic, values, function(err){
    if (err === null){
      callback(false, 'Profile picture has been successfully updated.');
    } else {
      console.log('ERROR MUUPP0101: Database Error', err);
      callback(true, 'Oops something went wrong.');
    }
  });
});