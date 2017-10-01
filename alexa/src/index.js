/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.______________be3d"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var Particle = require('particle-api-js');
var particle = new Particle();
var PARTICLE_DEVICE_ID = "_______3830";
var PARTICLE_ACCESS_TOKEN = "__________d22";
var AlexaSkill = require('./AlexaSkill');

var ParticleSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ParticleSkill.prototype = Object.create(AlexaSkill.prototype);
ParticleSkill.prototype.constructor = ParticleSkill;

ParticleSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ParticleSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

ParticleSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ParticleSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Particle Switch. You can ask me to turn the 3D printer on or off.";
    var repromptText = "You can ask me to turn the 3D printer on or off.";
    response.ask(speechOutput, repromptText);
};

ParticleSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ParticleSkill onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

ParticleSkill.prototype.intentHandlers = {
    // register custom intent handlers
    "ParticleStateIntent": function (intent, session, response) {
        var slot = intent.slots.state;
        var slotValue = slot ? slot.value : "";

        if(slotValue) {
          var fnPr = particle.callFunction({
            deviceId: PARTICLE_DEVICE_ID,
            name: slot.name,
            argument: slotValue,
            auth: PARTICLE_ACCESS_TOKEN
          });

          fnPr.then(
            function(data) {
              console.log('Function called succesfully:', data);

              var speechOutput = "The printer is now " + slotValue;
              response.tellWithCard(speechOutput, "3D Printer", speechOutput);
            }, function(err) {
              console.log('An error occurred:', err);
            });
        }
        else {
          response.tell("Sorry, I didn't catch what you said");
        }
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "You can ask me to turn on or off. You can also ask me to change colors, like red, green, blue, or white.";
        response.ask(speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the ParticleSkill skill.
    var particleSkill = new ParticleSkill();
    particleSkill.execute(event, context);
};
