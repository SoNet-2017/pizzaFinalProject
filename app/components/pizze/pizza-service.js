'use strict';

//The service implemented in this module will get information about all the available pizzas
angular.module('myApp.pizza.pizzaService', [])

    .factory('Pizza', function($firebaseArray) {
        var pizzaService = {
            getData: function () {
                var ref = firebase.database().ref().child("pizzas");
                // download the data into a local object
                return $firebaseArray(ref);
            }
        };
        return pizzaService;
    });
