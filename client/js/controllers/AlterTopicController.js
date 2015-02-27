//[AlterTopicController is used to Add Topics]
app.controller('AlterTopicController', ['$scope', '$rootScope', '$location', 'UserFactory', 'TopicFactory', function($scope, $rootScope, $location, UserFactory, TopicFactory) {
  //reroute to root if not logged in
  if (UserFactory.check_login()){
    //obj to hold for all scope variables
    $scope.app = {
      //default page settings and $rootScope variables
      forms : {
        topic : {
          doc : {
            name : 'Choose File'
          }
        }
      },
      settings : {
        user_level : $rootScope.user.user_level
        , name     : $rootScope.user.name
        , user_id  : $rootScope.user.id
        , message  : null
      }, patterns : {
        //regular expression patterns
        loose : /^[a-zA-Z\s\[\]()\/`~\-_:.,'"!@#$%^&*]*$/
      }, functions : {
        submitForm : function(valid){
          //add topic display or error messages
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
    };
  }
}]);