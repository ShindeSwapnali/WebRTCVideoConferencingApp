var express = require('express.io');
var app = express();
var https = require('https');
const secure = true;
if (secure === true) {
    const fs = require('fs');
    const options = {
        key: fs.readFileSync('./client-key.pem'),
        cert: fs.readFileSync('./client-cert.pem')
    };
    app.https(options).io();
} else {
    app.http(options).io();
}

//app.http().io();
const ADDRESS = '0.0.0.0';
var PORT = 3000;
console.log('server started on port ' + PORT);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index.ejs');
});


    app.listen(PORT,ADDRESS);

//message other client when some one new joins the chat
app.io.route('ready', function(req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	app.io.room(req.data).broadcast('announce', {
		message: 'New client in the ' + req.data + ' room.'
	})
})

app.io.route('send', function(req) {
    app.io.room(req.data.room).broadcast('message', {
        message: req.data.message,
		author: req.data.author
    });
})

app.io.route('signal', function(req) {
	//Note the use of req here for broadcasting so only the sender doesn't receive their own messages
	req.io.room(req.data.room).broadcast('signaling_message', {
        type: req.data.type,
		message: req.data.message
    });
})



