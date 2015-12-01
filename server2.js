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

app.use(express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/index2.html');
});
 
httpServer.listen(port); 

console.log('Servidor disponível em http://localhost:' + port);  

//Arduino  
board.on("ready", function() {

  

});
 
//Socket
io.on('connection', function (socket) {  
    console.log(socket.id);

    socket.on('led:on', function (data) {
      sensor = new five.Sensor.Digital(9);
      sensor.on("change", function(data) {
        console.log(this.value);  
        (this.value === 0) ? socket.emit('data', {estado: '100%', valor: 100}) : socket.emit('data', {estado: '0%', valor: 0});
      });
    });

    socket.on('data', function (data) {
        socket.emit('data', data);
    });
});
 
console.log('Aguardando Conexões...');