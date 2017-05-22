## AngularJS + Firebase: completed version of the Pizza++ app ##

This project is a simple AngularJS application used as running example during the lessons of the Social Networking course at Politecnico di Torino.

The application implements the following features:

- User Authentication
- Logout
- Registration of a new user
- Chat
- Load a list of elements (pizzas) from a Firebase database
- Load a map using the Google Maps service
- Add some markups to the loaded map
- Add a new element to the list of pizzas stored in the Firebase database
- Upload a file (the pizza image) in the Firebase storage and save the path in the database.

This final version was obtained by executing the following instructions to enhance the "Pizza++ Final Project Without Storage" project (imported from [https://github.com/SoNet-2017/pizzaFinalProjectWithoutStorage](https://github.com/SoNet-2017/pizzaFinalProjectWithoutStorage))

### Instructions to add the upload of the file ###

1. Open the "Pizza++ Final Project Without Storage" project (imported from [https://github.com/SoNet-2017/pizzaFinalProjectWithoutStorage](https://github.com/SoNet-2017/pizzaFinalProjectWithoutStorage))

2. Try to run the project and only if it works go to the next step, otherwise solve existing problems

3. We want to add a button to insert a descriptive image of the new pizza in the "addPizzaView" view.

4. Let's open the AngularFire documentation at [Uploading & Downloading Binary Content | AngularFire Guide](https://github.com/firebase/angularfire/blob/master/docs/guide/uploading-downloading-binary-content.md)

5. Starting from the last point of the instruction list, let's start from retrieving a file from the template to, then, upload it in the storage.

    1. Create a new directory in the components one calling it "file-upload"
    
    2. Create a parent file (file-upload.js) inside this folder:
    
        ```
        'use strict';
        
        //declare the module that will act as parent of all the services/directives used to upload a new file on Firebase
        angular.module('myApp.fileUpload', [
            'myApp.fileUpload.fileUploadDirective',
        ])
        
        .value('version', '0.1');
        ```
        
    3. Create a file for the directive we want to implement (copy the source code from the documentation, but rename the module and the the directive itself):
        
        ```
        'use strict';
        
        angular.module('myApp.fileUpload.fileUploadDirective', [])
            .directive("fileUpload", FileUploadDirective);
        
        function FileUploadDirective() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    onChange: "="
                },
                template: '<input type="file" name="file" /><label><ng-transclude></ng-transclude></label>',
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        scope.onChange(element.children()[0].files);
                    });
                }
            }
        }
        ```
    
    4. Include these 2 files in index.html
     
        ```
        <script src="components/file-upload/file-upload.js"></script>
        <script src="components/file-upload/file-upload-directive.js"></script>
        ```

    5. Include the parent module in app.js:
         
        ```
        ...
        angular.module('myApp', [
            ...
            'myApp.fileUpload'
        ])
        ...
        ```

    7. Modify the "addPizzaViewCtrl" controller in "addPizzaView.js" following the code reported in the documentation:
    
        ```
        .controller('addPizzaViewCtrl', ['$scope', '$rootScope', 'InsertPizzaService', '$firebaseStorage',
            function($scope, $rootScope, InsertPizzaService, $firebaseStorage) {
                $scope.dati = {};
                $rootScope.dati.currentView = "addPizza";
                $scope.dati.feedback = "";
                $scope.addPizza = function() {
                    InsertPizzaService.insertNewPizza($scope.dati.address, $scope.dati.nome_pizza, $scope.dati.nome_pizzeria).then(function(ref) {
                        var pizzaId = ref.key;
                        InsertPizzaService.updatePizza(pizzaId);
                        $scope.dati.feedback = "Inserimento effettuato con successo";
                        $scope.dati.address = "";
                        $scope.dati.nome_pizza = "";
                        $scope.dati.nome_pizzeria = "";
                    });
                }
                var ctrl = this;
                var storageRef = firebase.storage().ref("userProfiles/physicsmarie");
                var storage = $firebaseStorage(storageRef);
                $scope.fileToUpload = null;
                ctrl.onChange = function onChange(fileList) {
                    $scope.fileToUpload = fileList[0];
                    console.log($scope.fileToUpload.name);
                };
            }]);
        ```
        
    8. Modify the "appPizzaView.html" in this way:
        ```
        <div  ng-controller="addPizzaViewCtrl as $ctrl">
            <div class="alert alert-success alert-dismissible" role="alert" ng-if="dati.feedback">{{ dati.feedback }}</div>
            <form id="frmAddPizza" role="form" ng-submit="addPizza()">
                <h2>Add a new pizza</h2>
                <div class="form-group">
                    <b>Descriptive image:</b>
                    <file-upload on-change="$ctrl.onChange">
                    </file-upload>
                </div>
                <div class="form-group">
                    <label for="txtName">Name</label>
                    <input type="text" class="form-control" id="txtName" placeholder="Enter name" name="name" ng-model="dati.nome_pizza" />
                </div>
                <div class="form-group">
                    <label for="txtPizzeria">Pizzeria</label>
                    <input type="text" class="form-control" id="txtPizzeria" placeholder="Enter the name of the pizzeria" name="pizzeria" ng-model="dati.nome_pizzeria" />
                </div>
                <div class="form-group">
                    <label for="txtAddress">Pizzeria address</label>
                    <input type="text" class="form-control" id="txtAddress" placeholder="Enter the address of the pizzeria" name="address" ng-model="dati.address" />
                </div>
                <button type="submit" class="btn btn-success center-block">Insert</button>
            </form>
        </div>
        ```
        We simply added a grouping div with the name of the corresponding controller. In addition we added the button to select a file.
        
    9. Try to run the project and try to press the "Select file" button: if everything is ok, you should see an "OK" in the browser console.

6. Implement the function that actually upload the file. Thus, modify the ctrl.onChange function implemented in "addPizzaView.js":
        ```
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
                storage.$put($scope.fileToUpload);
            };
        ```
7. Modify the controller so that:
- when the user clicks on the "Insert" button, the "addPizza" function is called
- the "addPizza" function should does the following actions:
    - check if the user inserted every required information (except the image)
    - if the image was selected, upload it on firebase and return the path of the generated file in a variable and then add it in the Firebase database, with other info.
    - if the image was not selected, insert the new pizza in the database without any image
    
8. Consequently, at first, modify the service that save data to the Firebase database to accept one more parameter as input (the path of the file).
Modify "components/pizze/insert-pizza-service":
    ```
    ...
    var NewPizzaService = {
        insertNewPizza: function (address, nome_pizza, nome_pizzeria, imgPath) {
            //add the user to list of users and set the logged value to true
            var ref = firebase.database().ref().child("pizzas");
            // create a synchronized array
            return $firebaseArray(ref).$add({
                address: address,
                nome_pizza: nome_pizza,
                nome_pizzeria: nome_pizzeria,
                img_url: imgPath,
                img_alt: nome_pizzeria+" "+nome_pizza
            });
        },
    ...
    ```
    
9. Then, modify the "addPizzaViewCtrl" in this way:

    ```
    .controller('addPizzaViewCtrl', ['$scope', '$rootScope', InsertPizzaService', '$firebaseStorage',
        function($scope, $rootScope, InsertPizzaService, $firebaseStorage) {
            //initialize variables
            $scope.dati = {};
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
    ```

10. Finally, to let the app load successfully all the images, modify the "pizzaView.htm"l file:
    ```
    ...
        <div class="media-left">
            <img class="media-object" ng-src="../{{pizza.img_url}}" alt="{{pizza.img_alt}}" ng-if="!(pizza.img_url.includes('https://firebasestorage.googleapis.com')) && pizza.img_url!=''">
            <img class="media-object" ng-src="{{pizza.img_url}}" alt="{{pizza.img_alt}}" ng-if="pizza.img_url.includes('https://firebasestorage.googleapis.com')">
            <img class="media-object" ng-src="../images/notAvailable.png" alt="{{pizza.img_alt}}" ng-if="pizza.img_url == ''">
        </div>
        ...
    ```
