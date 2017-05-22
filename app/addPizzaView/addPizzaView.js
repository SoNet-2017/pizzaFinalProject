'use strict';

angular.module('myApp.addPizzaView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/addPizza', {
            templateUrl: 'addPizzaView/addPizzaView.html',
            controller: 'addPizzaViewCtrl',
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
    .controller('addPizzaViewCtrl', ['$scope', '$rootScope', 'InsertPizzaService', '$firebaseStorage',
        function($scope, $rootScope, InsertPizzaService, $firebaseStorage) {
            //initialize variables
            $scope.dati = {};
            //set the variable that is used in the main template to show the active button
            $rootScope.dati.currentView = "addPizza";
            $scope.dati.feedback = "";
            var ctrl = this;
            $scope.fileToUpload = null;
            $scope.imgPath= "";
            //define the function that will actually create a new record in the database
            $scope.addPizza = function() {
                //check if the user inserted all the required information
                if ($scope.dati.address!= undefined && $scope.dati.address!="" && $scope.dati.nome_pizza!= undefined && $scope.dati.nome_pizza!="" && $scope.dati.nome_pizzeria!=undefined && $scope.dati.nome_pizzeria!="") {
                    $scope.dati.error = "";
                    //try to upload the image: if no image was specified, we create a new pizza without an image
                    if ($scope.fileToUpload != null) {
                        //get the name of the file
                        var fileName = $scope.fileToUpload.name;
                        //specify the path in which the file should be saved on firebase
                        var storageRef = firebase.storage().ref("pizzeImg/" + fileName);
                        $scope.storage = $firebaseStorage(storageRef);
                        var uploadTask = $scope.storage.$put($scope.fileToUpload);
                        uploadTask.$complete(function (snapshot) {
                            $scope.imgPath = snapshot.downloadURL;
                            $scope.finalPizzaAddition();
                        });
                        uploadTask.$error(function (error) {
                            $scope.dati.error = error + " - the Pizza will be added without a descriptive image!";
                            //add the pizza in any case (without the image)
                            $scope.finalPizzaAddition();
                        });
                    }
                    else {
                        //do not add the image
                        $scope.finalPizzaAddition();

                    }
                }
                else
                {
                    //write an error message to the user
                    $scope.dati.error = "You forgot to insert one of the required information!";
                }
            };
            //initialize the function that will be called when a new file will be specified by the user
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };
            //function that will create the new record (with the pizza) in the Firebase storage
            $scope.finalPizzaAddition = function()
            {
                InsertPizzaService.insertNewPizza($scope.dati.address, $scope.dati.nome_pizza, $scope.dati.nome_pizzeria, $scope.imgPath).then(function(ref) {
                    var pizzaId = ref.key;
                    InsertPizzaService.updatePizza(pizzaId);
                    $scope.dati.feedback = "The pizza was successfully added";
                    $scope.dati.address = "";
                    $scope.dati.nome_pizza = "";
                    $scope.dati.nome_pizzeria = "";
                });
            }
        }]);