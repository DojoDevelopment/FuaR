//[Dashboard Controller is used to see all topics]
app.controller('DashboardController', ['$scope', '$rootScope', 'PageFactory', 'UserFactory', function($scope, $rootScope, PageFactory, UserFactory) {
  //check if user is logged in
  UserFactory.check_session(function(logged){
    if (logged){

      //set namespace object
      $scope.app = {
        //set default settings object
        settings : {
          user_level : $rootScope.user.user_level
          ,  user_id : $rootScope.user.user_id
          ,  message : null
        }, functions : {

          setSortVariable: function(sortVariable) {
            //filtering function
            $scope.app.topics.sortVariable = sortVariable;
            $scope.app.topics.isReverse = !$scope.app.topics.isReverse;

          }, setSortType: function(sortType){
            $scope.app.topics.type = sortType;

          }, log_out: function(){
            //logout function
            UserFactory.log_out();
          }
        }
      };

      //get all topics data
      PageFactory.dashboard(function(has_err, data){
        if(!has_err){
          //set topics data
          $scope.app.topics = data;
          $scope.app.topics.sortVariable = "updated_at";
          $scope.app.topics.isReverse = false;
          $scope.app.topics.type = '';
        } else {
          //display error message
          $scope.app.settings.message = data;
        }
      })
    }
  })
}]);