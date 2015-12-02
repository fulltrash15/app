// server.js
var express         = require('express');  
var app             = express();  
var httpServer      = require("http").createServer(app);  
var five            = require("johnny-five");  
var io              = require('socket.io')(httpServer);
var port            = 3000; 
var board           = new five.Board();
var led;
var state           = false;
var sensor;
var sensor2;

app.use(express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/index2.html');
});
 
httpServer.listen(port); 

console.log('Servidor disponível em http://localhost:' + port);  

//Arduino Ready
board.on("ready", function() { 

});
 
//Socket Connection
io.on('connection', function (socket) {  
    console.log(socket.id);

    //Event led:on
    socket.on('led:on', function (data) {
      //instantiate a new sensor on port 9 and 11
      sensor  = new five.Sensor.Digital(9);
      sensor2 = new five.Sensor.Digital(11);
      //change event
      sensor.on("change", function(data) {
        console.log("sensor 1: "+this.value); 
        (this.value === 0 && sensor2.value === 0) ? socket.emit('data', {estado: '100%', valor: 100}) : ((sensor2.value === 0) ? socket.emit('data', {estado: '50%', valor: 50}) : socket.emit('data', {estado: '0%', valor: 0}));
      });

      //change event
      sensor2.on("change", function(data) {
        console.log("sensor 2: "+this.value);  
        (this.value === 0 && sensor.value === 1) ? socket.emit('data', {estado: '50%', valor: 50}) : ((this.value === 0 && sensor.value === 0) ? socket.emit('data', {estado: '100%', valor: 100}) : socket.emit('data', {estado: '0%', valor: 0}));
      });

    });

    //event to emmit data
    socket.on('data', function (data) {
        socket.emit('data', data);
    });
});
 
console.log('Aguardando Conexões...');