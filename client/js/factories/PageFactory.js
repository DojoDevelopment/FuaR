app.factory('PageFactory', ['$http', '$location', '$rootScope', function($http, $location, $rootScope){
  return {
    settings : function(callback){
      //settings page
      //on success return admin or user array
      //on error send message or to login

      $http
        .get('/api/page/settings')
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        })

    }, profile : function(id, callback){
      //get topic by user id for users page
      //on success return array of user topics
      //on error send message or send to login

      $http
        .get('/api/page/profile/' + id)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        });

    }, dashboard : function(callback){
      //get all topics for dasboard
      //on success get array of topic data
      //on error send message or send to login

      $http
        .get('/api/page/dashboard')
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          status === 401 ? $location.path('/') : callback(true, data);
        });

    }, view_topic : function(id, callback){
      //get topic by topic id for topic page
      //on success return array of topic data
      //on error send message or send to login

      $http
        .get('/api/page/topic/'+ id)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data, status){
          status === 401 ? $location.path('/dasboard') : callback(true, data);
        });
    }
  }
}]);