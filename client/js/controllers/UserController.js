//[User Controller is used to see all topics for user]
app.controller('UserController', ['$scope', '$rootScope', '$location', 'PageFactory', 'UserFactory', function($scope, $rootScope, $location, PageFactory, UserFactory) {

  //reroute to root if not logged in
  UserFactory.check_session(function(logged){
    if (logged){
      //obj to hold for all scope variables
      $scope.app = {};

      $scope.app.settings = {
          user_id    : $rootScope.user.user_id
        , user_level : $rootScope.user.user_level
        , page_id    : _.last($location.path().split('/'))
        , message    : null
      };

      $scope.app.functions = {
        log_out : function(){ UserFactory.log_out(); }
      };

      //get approiate topics for the user id of topic_id
      PageFactory.profile($scope.app.settings.page_id, function(has_err, data){
        if (!has_err) {
          $scope.app.topics = data.topics;
          $scope.app.user = data.user;
        } else {
          $scope.app.settings.message = data;
        }
      })
    }
  });//end check_session
}]);//end controller