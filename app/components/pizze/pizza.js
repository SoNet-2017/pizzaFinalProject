'use strict';

//declare the module that will act as parent of all the services dedicated to retrieve/save information about the pizzas
angular.module('myApp.pizza', [
    'myApp.pizza.pizzaService',
    'myApp.pizza.singlePizzaService',
    'myApp.pizza.insertPizzaService'
])

.value('version', '0.1');
