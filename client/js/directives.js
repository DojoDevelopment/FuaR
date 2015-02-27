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

app.directive("displayFile", function () {

    var updateElem = function (element) {
        return function (displayFile) {
            element.empty();

            var objectElem = {}
            if (displayFile && displayFile.type !== "") {
                if (displayFile.type === "pdf") {
                    objectElem = angular.element(document.createElement("object"));
                    objectElem.attr("data", displayFile.fileUrl);
                    objectElem.attr("type", "application/pdf");
                }
                else {
                    objectElem = angular.element(document.createElement("img"));
                    objectElem.attr("src", displayFile.fileUrl);
                }
            }
            element.append(objectElem);
        };
    };

    return {
        restrict: "EA",
        scope: {
            displayFile: "="
        },
        link: function (scope, element) {
            scope.$watch("displayFile", updateElem (element));
        }
    };
});