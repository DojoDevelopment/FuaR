app.controller('LandingController', ['$scope', 'UserFactory',  function($scope, UserFactory) {

  //set default app object
  $scope.app = {};

  //set server messages to null
  $scope.app.messages = null

  //scope app functions object
  $scope.app.functions = {
    submitForm : function(valid){
      if (valid) {
        //log user in or display error message
        UserFactory.login($scope.app.forms.login, function(data){
          $scope.app.messages = data;
        });
      }
    }
  };

  //delete when in production
  $scope.app.forms = {
    login : {
        email: 'tony@gmail.com'
      , password: 'password'
    }
  };
}]);