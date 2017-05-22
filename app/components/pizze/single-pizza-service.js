'use strict';

//The service implemented in this module will get information about a single pizza: the one specified by the Id passed as argument of the function
angular.module('myApp.pizza.singlePizzaService', [])

    .factory('SinglePizza', function($firebaseObject) {
        var singlePizzaService = {
            getSinglePizza: function (pizzaId) {
                var ref = firebase.database().ref().child("pizzas").child(pizzaId);
                // download the data into a local object
                return $firebaseObject(ref);
            }
        };
        return singlePizzaService;
    });
