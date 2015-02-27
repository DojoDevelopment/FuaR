app.factory('ServerFactory', ['$http', '$rootScope', function($http, $rootScope){

  return {
    check_session : function(){
      $http.get('/api/users/session')
        .success(function(data){
          $rootScope.user = {
            user_level   : data.user_level
            , file_name  : data.file_name
            , name       : data.name
            , id         : data.user_id
          }
        })
    }
  }

}]);