//[Dashboard Controller is used to see all topics]
app.controller('DashboardController', ['$scope', '$rootScope', 'PageFactory', 'UserFactory', function($scope, $rootScope, PageFactory, UserFactory) {
  //check if user is logged in
  if (UserFactory.check_login()){

    //set namespace object
    $scope.app = {
      //set default settings object
      settings : {
        user_level : $rootScope.user.user_level
        ,  message : null
        ,     name : $rootScope.user.name
        ,  user_id : $rootScope.user.id
      }, functions : {

        setSortVariable: function(sortVariable) {
          //filtering function
          $scope.app.topics.sortVariable = sortVariable;
          $scope.app.topics.isReverse = !$scope.app.topics.isReverse;

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
      } else {
        //display error message
        $scope.app.settings.message = data;
      }
    })
  }
}]);