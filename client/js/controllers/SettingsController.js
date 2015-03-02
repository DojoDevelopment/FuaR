//Settings Controller is used in route: root/user/:id/settings for logged in users
app.controller('SettingsController', [ '$scope', '$rootScope', '$location', 'PageFactory', 'UserFactory', 'TopicFactory', function($scope, $rootScope, $location, PageFactory, UserFactory, TopicFactory) {
  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
      $scope.app = {};

      $scope.app.settings = {
        user_level : $rootScope.user.user_level
        , user_id  : $rootScope.user.user_id
        , top_message  : null
        , bottom_message : null
      }

      $scope.app.forms = {
          profile : {
            pic : { name: 'Choose Profile Pic' }
          }
        }

      //regular expressions for inputs
      $scope.app.patterns = {
        password : /^[a-zA-Z0-9_]{6,72}$/ //all letters numbers and underscore must be 6-72 characters
        ,  email : /[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/ //email
      }

      $scope.app.functions = {
        update_admin : function(index, level){

          if ($scope.app.settings.user_level === 10){
            //Check if user level is different than clicked state
            if ($scope.app.table[index].user_level !== level ){

              //update user_level and confirm message or set error message
              UserFactory.update_admin({user: $scope.app.table[index], level: level}, function(has_err, msg){
                if(!has_err) {
                  $scope.app.table[index].user_level = level;
                }
                $scope.app.settings.bottom_message = msg;
              })
            }
          }
        }, delete_topic : function(index){

          TopicFactory.delete_topic($scope.app.topics[index].topic_id, function(has_err, data){
            if (!has_err){
              $scope.app.topics.splice(index, 1);
            }
            $scope.app.settings.bottom_message = data;
          });

        }, isMatch : function(){

          $scope.app.forms.pass.isMatch = ($scope.app.forms.pass.password === $scope.app.forms.pass.confirm);
          $scope.app.forms.passwordForm.confirm.$setValidity('match', ($scope.app.forms.pass.isMatch == false ? false : true ));

        }, submitForm : function(valid, form){
          if (valid){
            if (form === 'pic' && $scope.app.forms.profile.pic.size === undefined ){
              $scope.app.forms.profile.pic.name = 'no file chosen';
            } else {
              switch(form){
                case 'email' :
                  UserFactory.update_email({email: $scope.app.forms.email}, function(data){
                    $scope.app.settings.top_message = data;
                  });

                break;
                case 'pic' :
                  //check if file is there or send error message
                  UserFactory.update_pic($scope.app.forms.profile, function(data){
                    $scope.app.settings.top_message = data;
                  });
                break;
                case 'password' :

                  UserFactory.update_password($scope.app.forms.pass, function(data){
                    $scope.app.settings.top_message = data;
                  });

                break;
              }
            }
          } else if (!valid && form == 'pic'){
            console.log('in pic');
            $scope.app.forms.profile.pic.name = 'no file chosen';
          }

        }, update_privacy: function(index){
          //method for admin to update privacy
          //update privacy setting
          TopicFactory.privacy($scope.app.topics[index].topic_id, function(has_err, data){

            //if no errors occured switch public state or get rid of button
            if (!has_err){ $scope.app.topics[index].is_public = true; }

            //display message
            $scope.app.settings.bottom_message = data;

          });

        }, log_out: function(){ UserFactory.log_out(); }
      }

      PageFactory.settings(function(has_err, data){
        if (!has_err){
          $scope.app.forms.email = data.email;
          $scope.app.settings.user_level === 10
            ? $scope.app.table = data.users
            : $scope.app.topics = data.topics;
        } else {
          $scope.app.settings.top_message = data;
        }
      });
    }
  });
}]);