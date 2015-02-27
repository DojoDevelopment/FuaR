//[AlterTopicController is used to Add Topics]
app.controller('AlterTopicController', ['$scope', '$rootScope', '$location', 'UserFactory', 'TopicFactory', function($scope, $rootScope, $location, UserFactory, TopicFactory) {
  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
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
            if (valid) {
              TopicFactory.add_topic($scope.app.forms.topic, function(has_err, data){
                if (has_err){
                  $scope.app.settings.message = data; //error message
                } else {
                  $location.url('/user/' + $scope.app.settings.user_id)
                }
              });
            }
          }, check_file : function(){
            $scope.app.forms.topic.file = ($scope.app.forms.topic.doc.name !== 'Choose File');
            $scope.app.forms.topicForm.$setValidity('file', ($scope.app.forms.topic.file === true ? true : false ));
          }, log_out : function(){
            //logout function
            UserFactory.log_out();
          }
        }
      };
    }
  })
}]);