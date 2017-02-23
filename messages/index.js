/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
bot.dialog('/', intents);  
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
// intents.matches('None', (session, args) => {
//     session.send('Hi! This is the None intent handler. You said: \'%s\'.', session.message.text);
// });

intents.matches('Greeting', [(session, args, next) => { 
    session.send('Welcome! This is the "Pick Your Pokemon Chatbot"! Pick a Pokemon Type.')
    // builder.Prompts.text('Pick a Pokemon Type.')
    }, 
    function(session, results){
        //LUIS call to parse pokemon type
        //if the results we receive from LUIS contains entities that match a pokemon type, we will start the '/PickType' dialog.
        var options = {
            host: luisAPIHostName,
            path: LuisAppId + '?subscription-key=' + luisAPIKey + "&q=" + results.response.replace(/ /g, '%20') + "&verbose=true"
        }
         new Promise(function(resolve,reject) {
            let request = require("https").request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    response += chunk;
                });
                res.on('error', function(err) {
                    return reject(err);
                });
                res.on('end', function() {
                    if(!response) {
                        return resolve('');
                    }
                    return resolve(response)
                });
            }).end()
        })
        .then(function(res) {
            var json = JSON.parse(res);
            var type = json.entities[0]['type'] ? json.entities[0]['type'] : null;
            if(!type) {
                session.send("You didn't pick a valid Pokemon type, so I'll end the conversation!");
                builder.DialogAction.endDialog();
            } 
            else if(type) {
                session.userData.PokemonType = type;
                session.beginDialog('/PickType', session);
            }
        })
    }   
]);

intents.matches('PickType', (session, args, next) => { 
    session.beginDialog('/PickType', session)
});

bot.dialog('/PickType', [(session, args, next) => {
    var LUISTypes = ['fire','electric','ground','water','bug','fighting','normal','poison','dragon','flying'];
    for(var i = 0; i < LUISTypes.length; i++) {
       if(!session.userData.PokemonType) {
            session.userData.PokemonType = builder.EntityRecognizer.findEntity(args.entities, LUISTypes[i]) ? builder.EntityRecognizer.findEntity(args.entities, LUISTypes[i]).type : null;
        }
        if(session.userData.PokemonType) {
            break;
        }
    }

    if(session.userData.PokemonType) {
       var options = {
           host: 'pokeapi.co',
           path: 'api/v2/type/' + session.userData.PokemonType
       }
       new Promise(function(resolve,reject) {
           let request = require("https").request(options, function(res) {
               res.setEncoding('utf8');
               res.on('data', function(chunk) {
                   response += chunk;
               });
               res.on('error', function(err) {
                   return reject(err);
               });
               res.on('end', function() {
                   if(!response) {
                       return resolve('');
                   }
                   return resolve(response)
               });
           }).end()
       })
       .then(function(res) {
           var json = JSON.parse(res);
           var idx = Math.floor((Math.random() * json.pokemon.length));
           var pokemonName = json.pokemon[idx]['pokemon']['name'];
           session.send("Your new " + json.name + "-type Pokemon is " + pokemonName);
           session.endDialog();
       })
    } 

}]);

intents.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});  

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
