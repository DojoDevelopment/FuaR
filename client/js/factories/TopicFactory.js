// //USED IN CONTROLLER: business
app.factory('TopicFactory', ['$http', '$location', '$rootScope', function($http, $location, $rootScope){
  var fd;
  return {
    //post a comment on topic
    //on success return array of comment infomation
    //on error send message or send to login
    add_post : function(id, obj, callback){

      $http
        .post('/api/comment/' + id, obj)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        });

    //add topic to database
    //on success topic is added to database
    //on error message is displayed to user
    }, add_topic : function(form, callback){

      fd = new FormData();
      _.each(form, function(value, key, form){
        fd.append(key, value);
      });

      $http
        .post('/api/topics', fd, {
            transformRequest: angular.identity
            , headers: { 'Content-Type': undefined }  //lets the browser decide that it's multipart form, if defined as multipart process throws error
        })
        .success(function(){
          $location.path('/user/' + $rootScope.user.user_id);
        })
        .error(function(data, status){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        });

    }, add_video: function(topic_id, video, callback){

      fd = new FormData();
      fd.append('file', video);

      $http.post('/api/video/'+ topic_id, fd, {
        transformRequest: angular.identity
        , headers: {'Content-Type': undefined}
      })
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          callback(true, data);
        })

    }, add_file : function(topic_id, file, callback){

      fd = new FormData();
      fd.append('file', file);

      $http.post('/api/file/'+ topic_id, fd, {
        transformRequest: angular.identity
        , headers: {'Content-Type': undefined}
      })
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          callback(true, data);
        })


    }, privacy : function(id, callback){
      //update a topics privacy settings
      //on success update topic setting return message
      //on error return error message
      $http
        .post('/api/privacy/' + id)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        })

    }, delete_topic : function(topic_id, callback){

      $http
        .delete('api/topics/'  + topic_id)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        })
    }, update_status : function(topic_id, obj, callback){

      $http
        .post('/api/topic/' + topic_id + '/status', obj)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        })
    }
  }
}]);