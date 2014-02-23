var Song = function(data) {
	return {
		song: data.body,
		date: data.date_created
	}
}

var master = require('twilio')('AC98eb705703556ad95bc5cf7e4b1cbc8b', 'a198863452f1e840159ff4f102556c7f');

exports.setup = function(app) {

	app.get('/new_number', function(request, result) {
		var country = request.query.country;
		var phone_numbers = [];
		master.availablePhoneNumbers(country).local.list({ sms_enabled: true }, function(err, numbers) {
			if (numbers["available_phone_numbers"].length > 0) {
				var phoneNumber = numbers["available_phone_numbers"][0];
				request.cookies.account.phone = phoneNumber;
				if (request.cookies.account) {
					result.cookie("phone", { phone: phoneNumber });
					result.redirect("/party/" + request.cookies.account.name);
				} else {
					result.send("Improper cookies! Create an account first.");
				}
			} else {
				result.send("Out of phone numbers!");
			}
		});

	});

	app.get('/new_account', function(request, result) {
		var name = request.query.name;
		var country = request.query.country;
		master.accounts.create({
			"friendlyName": name
		}, function(err, account) {
			result.cookie("account", { name: name, sid: account.sid, auth_token: account.auth_token });	
			result.redirect('/new_number?country=' + country);
		});
	});

	app.get('/party/:id', function(request, result) {
		if (request.cookies.account && request.cookies.phone) {
			result.send("In room '" + request.params.id + "' with number " + request.cookies.phone.phone.friendlyName);
		} else {
			result.send("Sad panda. :(");
		}
	});

	app.get('/test', function(request, result) {
		//Send an SMS text message
		master.sendMessage({

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

	app.get('/phone/:id', function(request, result) {
		var id = request.params.id;
		var sid = request.cookies.account ? request.cookies.account.sid : undefined;
		var authToken = request.cookies.account ? request.cookies.account.auth_token : undefined;

		if (!sid || !authToken) {
			console.log("Missing cookie info");
			master.accounts.list({ status: "active" }, function(err, data) {
				console.log("Looking for match...");
				data.accounts.forEach(function(account) {
					if (account.friendlyName == id) {
						console.log("Match found!");
						sid = account.sid;
						authToken = account.auth_token;
						result.cookie("account", { name: id, sid: sid, auth_token: authToken });
					}
				});	
				var client = require('twilio')(sid, authToken);
				client.incomingPhoneNumbers.list(function(err, data) {
					if (data.incomingPhoneNumbers && data.incomingPhoneNumbers.length > 0) {
						result.cookie("phone", data.incomingPhoneNumbers[0]);
						result.send(data.incomingPhoneNumbers[0]);
					}
				});
			});
		} else {
			var client = require('twilio')(sid, authToken);
			client.incomingPhoneNumbers.list(function(err, data) {
				if (!request.cookies.phone) {
					if (data.incomingPhoneNumbers && data.incomingPhoneNumbers.length > 0) {
						result.cookie("phone", data.incomingPhoneNumbers[0]);
					}		
				}
				result.send(data.incomingPhoneNumbers);
			});
		}
	});

	app.post('/text', function(request, results) {
		var text = request.body;
		var song = text.Body;
		console.log("Requested song: " + song);
	});

	app.get('/texts2/:id', function(request, result) {
		var id = request.params.id;
		var sid = request.cookies.account ? request.cookies.account.sid : undefined;
		var authToken = request.cookies.account ? request.cookies.account.auth_token : undefined;

		if (!sid || !authToken) {
			console.log("Missing cookie info");
			master.accounts.list({ status: "active" }, function(err, data) {
				console.log("Looking for match...");
				data.accounts.forEach(function(account) {
					if (account.friendlyName == id) {
						console.log("Match found!");
						sid = account.sid;
						authToken = account.auth_token;
						result.cookie("account", { name: id, sid: sid, auth_token: authToken });
					}
				});	
				var client = require('twilio')(sid, authToken);
				var messages = client.messages.list(function(err, data) {
					var songs = [];
					data.messages.forEach(function(msg) {
						songs.push(new Song(msg));	
					});
					result.jsonp(songs);
				});
			});
		} else {
			var client = require('twilio')(sid, authToken);
			var messages = client.messages.list(function(err, data) {
				var songs = [];
				data.messages.forEach(function(msg) {
					songs.push(new Song(msg));	
				});
				result.jsonp(songs);
			});
		}
	});

	app.get('/texts', function(request, results) {
		var messages = master.messages.list(function(err, data) {
			var songs = [];
			data.messages.forEach(function(msg) {
				songs.push(new Song(msg));	
			});
			results.jsonp(songs);
		});
	});

	app.get('/list', function(request, result) {
		master.accounts.list({ status: "active" }, function(err, data) {
			result.send(data.accounts);
		});

	});
}
