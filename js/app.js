var app = angular.module('ArduinoApp', ['btford.socket-io']);

//socket factory    
app.factory('socket', function (socketFactory) {
        return socketFactory();
});

//controller
app.controller('ArduinoController', function ($scope,socket) {
 	
 	$scope.leds = [];

    $scope.ledOn = function () {
        socket.emit('led:on');
    };

    $scope.ledOff = function () {
        socket.emit('led:off');  
    };

    socket.on('data', function (data) {
    	$scope.leds.push(data);
    })

});