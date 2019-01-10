/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot.
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

var json = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "fallbackText": "<img src=/ onerror=javascript:alert(\"FALLBACK RAWR\")>",
    "version": "1.2",
    "body": [
      {
        "speak": "Tom's Pie is a Pizza restaurant which is rated 9.3 by customers.",
        "type": "ColumnSet",
        "columns": [
          {
            "type": "Column",
            "width": 2,
            "items": [
              {
                "type": "TextBlock",
                "text": "PIZZA"
              },
              {
                "type": "TextBlock",
                "text": "Tom's Pie",
                "weight": "bolder",
                "size": "extraLarge",
                "spacing": "none"
              },
              {
                "type": "TextBlock",
                "text": "4.2 ★★★☆ (93) · $$",
                "isSubtle": true,
                "spacing": "none"
              },
              {
                "type": "TextBlock",
                "text": "**Matt H. said** \"I'm compelled to give this place 5 stars due to the number of times I've chosen to eat here this past year!\"",
                "size": "small",
                "wrap": true
              }
            ]
          },
          {
            "type": "Column",
            "width": 1,
            "items": [
              {
                "type": "Image",
                "url": "https://picsum.photos/300?image=882",
                "size": "auto"
              }
            ]
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "Action.OpenUrl",
        "title": "More Info",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      }
    ]
  }

  var card = {
      'contentType': 'application/vnd.microsoft.card.adaptive',
      'content': json
  }

bot.dialog('/', function (session) {
    var msg = new builder.Message(session)
    .addAttachment(card);
    session.send(msg);
    session.endDialog();
});
