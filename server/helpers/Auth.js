var regex = require('./RegexFunctions.js');
module.exports = {
	/**
	 * [check if session is undefined or if user level is less then specified]
	 * @param  {[Object]} session 		[user's session data]
	 * @param  {[Number]} requirement [set a bar for user level ]
	 * @return {[Boolean]} True if user level is at or above requirement
	 */
	check_login : function(session, requirement){
		if (session == undefined ){
			return false;
		}
		if (session.user_level < requirement){
			return false
		}
		return true;
	/**
	 * [check if params is a number]
	 * @param  {[Object]} params 		[user's params]
	 * @return {[Boolean]} True if params are a number
	 */
	}, check_params : function(params){
		return (params !== undefined && regex.isNumber(params));
	}
}