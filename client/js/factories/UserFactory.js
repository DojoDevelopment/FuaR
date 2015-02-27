app.factory('UserFactory', ['$http', '$location', '$rootScope', function($http, $location, $rootScope){
  var fd;
  return {

    //send form data to server to verify login credentials
    //on success set information to $rootscope and send them to dashboard
    //on err send them a message
    login : function(form, callback){

      $http.post('/api/users/login', form)
        .success(function(data){
          $rootScope.user = {
              user_level : data.user_level
            ,  file_name : data.file_name
            ,       name : data.name
            ,         id : data.id
          }
          if ( $rootScope.user.user_level < 5 ){
            // $location.path('/settings');
           $location.path('/user/' + $rootScope.user.id);
          } else {
            $location.path('/dashboard');
          }
        })
        .error(function(data){
          callback(data);
        });

    //send form data to server to verify registration data
    //on success set session data and $rootScope data and send to dashboard
    //on error send message
    }, register : function(form, callback){
        fd = new FormData();
        _.each(form, function(value, key, form){
          fd.append(key, value);
        });

        $http.post('/api/users/register', fd, {
            transformRequest: angular.identity
            , headers: { 'Content-Type': undefined }  //lets the browser decide that it's multipart form, if defined as multipart process throws error
          })
          .success(function(data){
            $rootScope.user = {
              user_level   : data.user_level
              , file_name  : data.file_name
              , name       : data.name
              , id         : data.user_id
            }
            $location.path('/dashboard');

        })
        .error(function(data){
          callback(data);
        });

    //logout function to clear session data and rootscope data.
    }, log_out : function(){
      $http.post('/api/users/logout')
        .success(function(){
          $rootScope.user = undefined;
          $location.path('/');
        })

    }, update_admin : function(obj, callback){
    //update user's user_level
    //on success set callback error to false and pass message
    //on error set callback error to true and pass message

      $http.post('/api/users/level', obj)
        .success(function(data){
          callback(false, data);
        })
        .error(function(data){
          //check if user is authorized
          //if authorized send them error message
          status === 401
            ? $location.path('/dashboard')
            : callback(true, data)
        });

    }, update_email : function(obj, callback){
      console.log(obj);
      $http.post('/api/users/email', obj)
        .success(function(data){
          callback(data);
        }).error(function(data){
          callback(data);
        })

    }, update_password : function(obj, callback){
      $http.post('/api/users/password', obj)
        .success(function(data){
          callback(data);
        }).error(function(data){
          callback(data);
        })

    }, update_pic : function(obj, callback){

      fd = new FormData();
      fd.append('pic_info', obj.pic);
      $http.post('/api/users/pic', fd, {
          transformRequest: angular.identity
          , headers: { 'Content-Type': undefined }  //lets the browser decide that it's multipart form, if defined as multipart process throws error
        })
        .success(function(data){
          $rootScope.user.file_name = data;
          callback(data);
        }).error(function(data){
          callback(data);
        })

    }, check_session : function(callback){
      if ($rootScope.user !== undefined) {
        callback(true);
      } else {
        $http.get('/api/users/session')
          .success(function(data){
            $rootScope.user = {
              user_level   : data.user_level
              , file_name  : data.file_name
              , name       : data.name
              , id         : data.id
            }
            callback(true);
          }).error(function(){
            $location.path('/')
          });
      }
    }
  }
}]);