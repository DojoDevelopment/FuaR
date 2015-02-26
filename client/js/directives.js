app.directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
}]);

app.directive('myTag', ['$http', function($http) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: '<iframe height="100%" width="100%" frameborder="0"></iframe>',
    scope:{
        src:"="
    },
    controller:function($scope){

      $http
        .get($scope.src, {
           'x-amz-acl': 'public-read'
          ,'Content-Type': 'application/pdf'
          ,'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }).success(function(result){
         console.log(result);
        })
        .error(function(result){
          alert("Error: No data returned");
        })
    }
  }
}]);
