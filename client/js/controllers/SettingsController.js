//Settings Controller is used in route: root/user/:id/settings for logged in users
app.controller('SettingsController', [ '$scope', '$rootScope', '$location', 'PageFactory', 'UserFactory', 'TopicFactory', function($scope, $rootScope, $location, PageFactory, UserFactory, TopicFactory) {
  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
      $scope.app = {
        settings : {
          user_level : $rootScope.user.user_level
          , name     : $rootScope.user.name
          , user_id  : $rootScope.user.id
          , message  : null
        }, forms : {
          profile : {
            pic : {
              name: 'Choose Profile Pic'
            }
          }

        }, patterns : {
          //regular expression patterns for forms
          password : /^[a-zA-Z0-9_]{6,72}$/ //all letters numbers and underscore must be 6-72 characters
          ,  email : /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/ //email
        }, functions : {
          update_admin : function(index, level){

            if ($scope.app.settings.user_level === 10){
              //Check if user level is different than clicked state
              if ($scope.app.table[index].user_level !== level ){

                //update user_level and confirm message or set error message
                UserFactory.update_admin({user: $scope.app.table[index], level: level}, function(has_err, msg){
                  if(!has_err) {
                    $scope.app.table[index].user_level = level;
                  }
                  $scope.app.settings.message = msg;
                })
              }
            }
          }, delete_topic : function(index){

            TopicFactory.delete_topic($scope.app.topics[index].topic_id, function(has_err, data){
              if (!has_err){
                $scope.app.topics.splice(index, 1);
              }
              $scope.app.settings.message = data;
            });

          }, isMatch : function(){

            $scope.app.forms.pass.isMatch = ($scope.app.forms.pass.password === $scope.app.forms.pass.confirm);
            $scope.app.forms.pass.confirm.$setValidity('match', ($scope.app.forms.pass.isMatch == false ? false : true ));

          }, submitForm : function(valid, form){

            if (valid){
              switch(form){
                case 'email' :

                  UserFactory.update_email($scope.app.forms.email, function(data){
                      $scope.app.settings.message = data;
                  });

                break;
                case 'pic' :
                //check if file is there or send error message
                UserFactory.update_pic($scope.app.forms.profile, function(data){
                    // $scope.app.settings.message = data;
                    $scope.app.forms.profile.pic.name = 'no file chosen';
                });
                break;
                case 'password' :

                  UserFactory.update_password($scope.app.forms.pass, function(data){
                      $scope.app.settings.message = data;
                  });

                break;
              }
            }

          }, update_privacy: function(index){
            //method for admin to update privacy
            //update privacy setting
            TopicFactory.privacy($scope.app.topics[index].topic_id, function(has_err, data){

              //if no errors occured switch public state or get rid of button
              if (!has_err){ $scope.app.topics[index].is_public = true; }

              //display message
              $scope.app.settings.message = data;

            });

          }, log_out: function(){
              //log out function
              UserFactory.log_out();
          }
        }
      };

      PageFactory.settings(function(has_err, data){
        if (!has_err){
          $scope.app.forms.email = data.email;
          $scope.app.settings.user_level === 10
            ? $scope.app.table = data.users
            : $scope.app.topics = data.topics;
        } else {
          $scope.app.settings.message = data;
        }
      });
    }
  });
}]);