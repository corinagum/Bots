/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

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

var inMemoryStorage = new builder.MemoryBotStorage;

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function(session) {
    if(session.message && session.message.value) {
        processSubmitAction(session, session.message.value);
        return
    }
    var card = {
        "type": "message",
        "text": "Here are a few scuba diving schools near Seattle, WA. Would you like to book a reservation with one?",
        "attachmentLayout": "carousel",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "size": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "size": "medium",
                                            "url": "http://adaptivecards.io/content/FabrikamLogo.png"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Fabrikam",
                                            "size": "large",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "4.1 stars",
                                            "separation": "none"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "text": "13 miles away",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "217 W Pine St.",
                            "separation": "none"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Seattle, WA 98126",
                            "separation": "none"
                        }
                    ]
                }
            },
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "size": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "size": "medium",
                                            "url": "http://adaptivecards.io/content/MargiesTravel.png"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Margie's Travel",
                                            "size": "large",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "4.4 stars",
                                            "separation": "none"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "text": "42 miles away",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "1602 E Avenue Rd.",
                            "separation": "none"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Gig Harbor, WA 98335",
                            "separation": "none"
                        }
                    ]
                }
            },
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "size": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "size": "medium",
                                            "url": "http://adaptivecards.io/content/Relecloud.png"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Relecloud Diving",
                                            "size": "large",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "4.7 stars",
                                            "separation": "none"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "text": "15 miles away",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "1210 W Hanford St.",
                            "separation": "none"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Seattle, WA 98105",
                            "separation": "none"
                        }
                    ]
                }
            },
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "size": "auto",
                                    "items": [
                                        {
                                            "type": "Image",
                                            "size": "medium",
                                            "url": "http://adaptivecards.io/content/AdventureWorksLogo.png"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": "Adventure Works",
                                            "size": "large",
                                            "weight": "bolder"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "3.2 stars",
                                            "separation": "none"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "text": "7 miles away",
                            "weight": "bolder"
                        },
                        {
                            "type": "TextBlock",
                            "text": "510 N Yale Ave.",
                            "separation": "none"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Seattle, WA 98127",
                            "separation": "none"
                        }
                    ]
                }
            }
        ]
    }

    var msg = new builder.Message(session)
        .addAttachment(card);
    session.send(msg);
});
bot.set('storage', inMemoryStorage);

// bot.dialog('/', function (session) {
//     session.send('You said ' + session.message.text);
// });