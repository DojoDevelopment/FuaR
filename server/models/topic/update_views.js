var query = require('../../helpers/Queries.js');
var code = 'MTUV'
module.exports = (function(id, db){

  //increment number of views by 1
  db.client.query(query.topic.update.views, [id], function(err){
    if (err !== null){
      console.log('ERROR ' + code + '0102: Database Error', err);
    }
  })

});