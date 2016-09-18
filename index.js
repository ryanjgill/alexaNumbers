'use strict';
var Alexa = require('alexa-sdk')
	, request = require('request')
	, APP_ID = 'amzn1.ask.skill.f5946570-beeb-4d3e-bb0c-a5236e571604'
	, SKILL_NAME = 'numbers'
	, numbersUrls = ['random/math', 'random/trivia']
	;

// call to get random number fact from numbers API
function getNumberFact(cb) {
	var random = Math.floor(Math.random() * numbersUrls.length);

	return request('http://numbersapi.com/' + numbersUrls[random], function (err, rsp, body) {
	  if (!err && rsp.statusCode == 200) {
			return cb(body);
	  } else {
			return cb('Numbers API appears to be unavailable at this time.');
	  }
	});
}

var handlers = {
	'LaunchRequest': function () {
		this.emit('GetNextFact');
	},
	'GetNextFactIntent': function () {
		this.emit('GetNextFact');
	},
	'GetNextFact': function () {
		var me = this;

		// get random number fact
		getNumberFact(function (fact) {
			me.emit(':tell', fact);
		});        
	},
	'AMAZON.HelpIntent': function () {
		var speechOutput = "You can ask me a when for a fact, or, you can say exit... What can I help you with?";
		var reprompt = "What can I help you with?";
		this.emit(':ask', speechOutput, reprompt);
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Goodbye!');
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Goodbye!');
	}
};

exports.handler = function(event, context, callback) {
	var alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};