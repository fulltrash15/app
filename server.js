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

app.use(express.static(__dirname + '/public'));
app.use('/lib', express.static(__dirname + '/bower_components'));
app.use('/js', express.static(__dirname + '/js'));
 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/index.html');
});
 
httpServer.listen(port); 

console.log('Servidor disponível em http://localhost:' + port);  

//Arduino  
board.on("ready", function() {  
    console.log('Arduino connected');
    led = new five.Led(13);    
});
 
//Socket
io.on('connection', function (socket) {  
    console.log(socket.id);

    socket.on('led:on', function (data) {
       //led.on();
       led.blink(1000, function(){
           console.log('LED ON');
           socket.emit('data', {estado: 'LED ON', hora: new Date()});
       });
    });

    socket.on('led:off', function (data) {
        led.stop().off();
        console.log('LED OFF');
        socket.emit('data', {estado: 'LED OFF', hora: new Date()});
    });

    socket.on('data', function (data) {
        socket.emit('data', data);
    });
});
 
console.log('Aguardando Conexões...');