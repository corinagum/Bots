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

    var cardtest = {
        'contentType': 'application/vnd.microsoft.card.adaptive',
        'content': {
            '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
            'type': 'AdaptiveCard',
            'version': '1.0',
            'body': [
                {
                    'type': 'Container',
                    'speak': '<s>Hello!</s><s>Are you looking for a flight or a hotel?</s>',
                    'items': [
                        {
                            'type': 'ColumnSet',
                            'columns': [
                                {
                                    'type': 'Column',
                                    'size': 'auto',
                                    'items': [
                                        {
                                            'type': 'Image',
                                            'url': 'https://placeholdit.imgix.net/~text?txtsize=65&txt=Adaptive+Cards&w=300&h=300',
                                            'size': 'medium',
                                            'style': 'person'
                                        }
                                    ]
                                },
                                {
                                    'type': 'Column',
                                    'size': 'stretch',
                                    'items': [
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Hello!',
                                            'weight': 'bolder',
                                            'isSubtle': true
                                        },
                                        {
                                            'type': 'TextBlock',
                                            'text': 'Are you looking for a flight or a hotel?',
                                            'wrap': true
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            'actions': [
                // Hotels Search form
                {
                    'type': 'Action.ShowCard',
                    'title': 'Hotels',
                    'speak': '<s>Hotels</s>',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'Welcome to the Hotels finder!',
                                'speak': '<s>Welcome to the Hotels finder!</s>',
                                'weight': 'bolder',
                                'size': 'large'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'Please enter your destination:'
                            },
                            {
                                'type': 'Input.Text',
                                'id': 'destination',
                                'speak': '<s>Please enter your destination</s>',
                                'placeholder': 'Miami, Florida',
                                'style': 'text'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'When do you want to check in?'
                            },
                            {
                                'type': 'Input.Date',
                                'id': 'checkin',
                                'speak': '<s>When do you want to check in?</s>'
                            },
                            {
                                'type': 'TextBlock',
                                'text': 'How many nights do you want to stay?'
                            },
                            {
                                'type': 'Input.Number',
                                'id': 'nights',
                                'min': 1,
                                'max': 60,
                                'speak': '<s>How many nights do you want to stay?</s>'
                            }
                        ],
                        'actions': [
                            {
                                'type': 'Action.Submit',
                                'title': 'Search',
                                'speak': '<s>Search</s>',
                                'data': {
                                    'type': 'hotelSearch'
                                }
                            }
                        ]
                    }
                },
                {
                    'type': 'Action.ShowCard',
                    'title': 'Flights',
                    'speak': '<s>Flights</s>',
                    'card': {
                        'type': 'AdaptiveCard',
                        'body': [
                            {
                                'type': 'TextBlock',
                                'text': 'Flights is not implemented =(',
                                'speak': '<s>Flights is not implemented</s>',
                                'weight': 'bolder'
                            }
                        ]
                    }
                }
            ]
        }
    };
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

    // var msg = new builder.Message(session)
    //     .addAttachment(cardtest);
    session.send(card);
});
bot.set('storage', inMemoryStorage);

// bot.dialog('/', function (session) {
//     session.send('You said ' + session.message.text);
// });