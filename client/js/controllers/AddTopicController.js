//[AlterTopicController is used to Add Topics]
app.controller('AddTopicController', ['$scope', '$rootScope', '$location', 'UserFactory', 'TopicFactory', function($scope, $rootScope, $location, UserFactory, TopicFactory) {
  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
      //obj to hold for all scope variables
      $scope.app = {}

      $scope.app.settings = {
          user_level : $rootScope.user.user_level
          , user_id  : $rootScope.user.user_id
          , message  : null
      }

      //default page settings and $rootScope variables
      $scope.app.forms = {
          topic : {
            doc : { name : 'Choose File' }
          }
      }

      $scope.app.functions = {
        //add topic display or error messages
        submitForm : function(valid){
          if (valid && $scope.app.forms.topic.doc.size !== undefined){
            TopicFactory.add_topic($scope.app.forms.topic, function(has_err, data){
              if (has_err){
                $scope.app.settings.message = data; //error message
              } else {
                $location.url('/user/' + $scope.app.settings.user_id)
              }
            });
          } else if ($scope.app.forms.topic.doc.size === undefined){
            $scope.app.forms.topic.doc.name = 'No File Chosen';
          }
        }, log_out : function(){
          //logout function
          UserFactory.log_out();
        }
      }
    }//end islogged
  });//end check session
}]);//end controller