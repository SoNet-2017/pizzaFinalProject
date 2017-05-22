'use strict';

// Initialize the Firebase SDK
var config = {
    apiKey: "AIzaSyASzMEUt7BfpWYA5WqNkijZam2OL66W3uE",
    authDomain: "pizzasonet2017.firebaseapp.com",
    databaseURL: "https://pizzasonet2017.firebaseio.com",
    projectId: "pizzasonet2017",
    storageBucket: "pizzasonet2017.appspot.com"
};
firebase.initializeApp(config);

// Declare app level module which depends on views, and components
angular.module('myApp', [
    "firebase",
    'ngRoute',
    'ngMap',
    'myApp.pizzaView',
    'myApp.pizza',
    'myApp.detailsView',
    'myApp.loginView',
    'myApp.authentication',
    'myApp.users',
    'myApp.usersListView',
    'myApp.chatView',
    'myApp.userProfileView',
    'myApp.userRegistrationView',
    'myApp.addPizzaView',
    'myApp.fileUpload'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/pizzaView'});
}])
    .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/loginView");
        }
    });
}])
    .controller('MainCtrl', ['$scope', '$rootScope', '$firebaseAuth', function($scope, $rootScope, $firebaseAuth) {
        //this controller only declares a function to get information about the user status (logged in / out)
        //it is used to show menu buttons only when the user is logged

        //set the variable that is used in the main template to show the active button
        $rootScope.dati = {};
        $rootScope.dati.currentView = 'home';
    $scope.isLogged = function()
    {
        if ($firebaseAuth().$getAuth())
            return true;
        else
            return false;
    }
}]);
