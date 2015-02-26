var regex    = require('../../helpers/RegexFunctions.js');
var response = require('../../helpers/Response.js')
var auth     = require('../../helpers/Auth.js');
var comment  = require('../../models/topic/post_comment.js');
var page_code = 'CTAC'

//post a comment on a topic
module.exports = (function(req, res, db){

  //check if user is logged in
  if ( auth.check_login(req.session.user, 1) ){
    //check if params are numbers
    if ( auth.check_params(req.params.id) ) {
      //check for a comment parent_id is not undefined and topic id is there
      if( req.body.text && req.body.parent_id !== undefined && req.params.id ) {

        //put form into an array for model [topic_id, user_id, comment, parent_id]
        var topic = [ req.params.id, req.session.user.id, req.body.text, req.body.parent_id ];

        //remove any script tags strips text
        topic = regex.sanitizeForm(topic);

        //test form contents are correct format
        if ( regex.isNumber(topic[0])
          && regex.isNumber(topic[1])
          && regex.noWedges(topic[2])
          && regex.isNumber(topic[3])
        ) {

          //run comment query return response
          comment(topic, db, function(has_err, data){
            !has_err ? response.success(res, data)
                     : response.error_data(res, data, page_code + '0103');
          });

        } else {
          //info is not in the correct format
          response.error_generic(res, page_code + '0104', 'invalid');
        }
      } else {
        //missing required info
        response.error_generic(res, page_code + '0103', 'missing');
      }
    } else {
      //params are not numbers
      response.error_generic(res, page_code + '0102', 'params');
    }
  } else {
    //user is not logged in
    response.error_generic(res, page_code + '0101', 'login', 401);
  }
});