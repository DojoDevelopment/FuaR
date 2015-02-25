//[User Controller is used to see all topics for user]
app.controller('UserController', ['$scope', '$rootScope', '$location', 'PageFactory', 'UserFactory', function($scope, $rootScope, $location, PageFactory, UserFactory) {

  //reroute to root if not logged in
  if (UserFactory.check_login()){

    //obj to hold for all scope variables
    $scope.app = {
      settings : {
        user_level : $rootScope.user.user_level
        , topic_id : _.last($location.path().split('/'))  //pages user id
        , message : null
        , name : $rootScope.user.name
        , user_id : $rootScope.user.id
        , page_id : _.last($location.path().split('/'))
      }, functions : {
        log_out : function(){ UserFactory.log_out(); }
      }, search : ''
    };

    //get approiate topics for the user id of topic_id
    PageFactory.profile($scope.app.settings.topic_id, function(has_err, data){
      has_err === true ? $scope.app.settings.message = data : $scope.app.topics = data;
    })
  }
}]);