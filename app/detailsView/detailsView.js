'use strict';

angular.module('myApp.detailsView', ['ngRoute','myApp.pizza'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/detailsPizza/:pizzaId', {
    templateUrl: 'detailsView/detailsView.html',
    controller: 'detailsViewCtrl',
      resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
              // $requireSignIn returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $routeChangeError (see above)
              return Auth.$requireSignIn();
          }]

      }
  })
}])
//Inline Array Annotation
    //Here we pass an array whose elements consist of a list of strings (the names of the dependencies)
    // followed by the function itself.
    //When using this type of annotation, take care to keep the annotation array
    // in sync with the parameters in the function declaration.
.controller('detailsViewCtrl', ['$scope', '$rootScope', '$routeParams', 'SinglePizza',
    function($scope, $rootScope, $routeParams, SinglePizza) {
        //initialize variables
        $scope.dati = {};
        $scope.dati.vm = this;
        $scope.dati.vm.positions = [];
        //set the variable that is used in the main template to show the active button
        $rootScope.dati.currentView = "home";
        //get the information of the pizza with Id like the one that was passed in the URL path
        $scope.dati.pizza = SinglePizza.getSinglePizza($routeParams.pizzaId);
        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6qAQOEvZs2XlUUu3ziu-nrDX-WWZXap4";
        //when the information about the pizza will be loaded, then the map will be created adding a marker in the Pizzeria location
        $scope.dati.pizza.$loaded().then(function () {
            var address = $scope.dati.pizza.address;
            $scope.dati.vm.positions.push({address: address});
        });
    }]);