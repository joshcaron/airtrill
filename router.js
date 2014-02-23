
exports.setup = function(app) {

	app.get('/test', function(request, result) {
		var client = require('twilio')('AC98eb705703556ad95bc5cf7e4b1cbc8b', 'a198863452f1e840159ff4f102556c7f');

		//Send an SMS text message
		client.sendMessage({

		    to:'8602519172', // Any number Twilio can deliver to
		    from: '+15087624751', // A number you bought from Twilio and can use for outbound communication
		    body: 'heyyyyyyy.' // body of the SMS message

		}, function(err, responseData) { //this function is executed when a response is received from Twilio

		    if (!err) { // "err" is an error received during the request, if any

		        // "responseData" is a JavaScript object containing data received from Twilio.
		        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
		        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

		        console.log(responseData.from); // outputs "+14506667788"
		        console.log(responseData.body); // outputs "word to your mother."

		    }
		});

		result.send("HEY");
	});

	// app.get('/lookup', function(request, result) {
	// 	// var soundcloud = require('soundclouder');
	// 	soundcloud.init('5829926db302ca49e853711971874eec', '894a5501f16d90b8c19c56130035ff4b', 'http://music.turtles.io/login');
	// 	var code;
	// 	soundcloud.auth(code, function (error, access_token) {
	// 		if(error) {
	// 			console.error(e.message);
	// 		} else {
	// 			console.log('access_token=' + access_token );
	// 		}
	// 	});
	// });

	// app.get('/login', function(request, result) {

	// });
}
