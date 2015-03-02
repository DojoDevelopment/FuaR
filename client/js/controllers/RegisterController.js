app.controller('RegisterController', ['$scope', 'UserFactory',  function($scope, UserFactory) {

  //set default app object
  $scope.app = {};

  //set server messages to null
  $scope.app.messages = null

  $scope.app.forms = {
    registration:{
      pic : { name : 'Upload Profile Pic' }
    }
  };

  //regular expression patterns for forms
  $scope.app.patterns = {
    alphanumeric : /^[a-zA-Z0-9_]*$/ //all letters and spaces
    , email      : /^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/ //email
    , password   : /^[a-zA-Z0-9_]{6,72}$/ //all letters numbers and underscore must be 6-72 characters
  }

  $scope.app.lists = {
    months : [  //month array
      {id: 01, month: 'January'},
      {id: 02, month: 'Febuary'},
      {id: 03, month: 'March'},
      {id: 04, month: 'April'},
      {id: 05, month: 'May'},
      {id: 06, month: 'June'},
      {id: 07, month: 'July'},
      {id: 08, month: 'August'},
      {id: 09, month: 'September'},
      {id: 10, month: 'October'},
      {id: 11, month: 'November'},
      {id: 12, month: 'December'},
    ], years : [ //year array
      {id: 10, year: 2010},
      {id: 11, year: 2011},
      {id: 12, year: 2012},
      {id: 13, year: 2013},
      {id: 14, year: 2014},
      {id: 15, year: 2015},
      {id: 16, year: 2016},
      {id: 17, year: 2017},
      {id: 18, year: 2018},
      {id: 19, year: 2019},
      {id: 20, year: 2020}
    ], locations : [ //location array
      {name: 'Burbank'},
      {name: 'San Jose'},
      {name: 'Seattle'}
    ]
  }

  $scope.app.functions = {
    submitForm : function(valid){
      if (valid) {
        //register user or display error message
        UserFactory.register($scope.app.forms.registration, function(data){
          $scope.app.messages = data;
        });
      }
    }, isMatch : function(){
      //function to test if password and confirm match in register page
      $scope.app.forms.registration.isMatch = ($scope.app.forms.registration.password === $scope.app.forms.registration.confirm);
      $scope.app.forms.regForm.confirm.$setValidity('match', ($scope.app.forms.registration.isMatch === false ? false : true ));
    }
  };

}]);