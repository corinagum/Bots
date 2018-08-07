using System;
using System.Threading.Tasks;

using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using System.Net.Http;
using AdaptiveCards;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json.Linq;

namespace Microsoft.Bot.Sample.SimpleEchoBot
{
    [Serializable]
    public class EchoDialog : IDialog<object>
    {
        protected int count = 1;

        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);
        }

        public async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> argument)
        {
            AdaptiveCard card = new AdaptiveCard();

            card.Body.Add(new AdaptiveTextBlock()
            {
                Text = "Adaptive Card rendering test",
                Size = AdaptiveTextSize.Large,
                Weight = AdaptiveTextWeight.Bolder
            });

            var choiceSet = new AdaptiveChoiceSetInput();
            choiceSet.Choices.Add(
                new AdaptiveChoice()
                {
                    Title = "Zuko",
                    Value = "zuko"
                });
            choiceSet.Choices.Add(new AdaptiveChoice()
            {
                Title = "Buko",
                Value = "buko"
            });
            card.Body.Add(choiceSet);

            Attachment attachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card
            };

            var replyToConversation = context.MakeMessage();
            replyToConversation.Attachments.Add(attachment);

            //return our reply to the user
            await context.PostAsync(replyToConversation);

            string json = @"{
    'contentType': 'application/vnd.microsoft.card.adaptive',
    'content': {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        'type': 'AdaptiveCard',
        'version': '1.0',
        'body': [
            {
                'type': 'TextBlock',
                'text': '{{title}}',
                'weight': 'bolder',
                'size': 'large'
            },
            {
                'type': 'TextBlock',
                'text': '{{shortText}}',
                'wrap': 'true'
            },
            {
                'type': 'TextBlock',
                'text': 'Date: {{date}}',
                'separator': 'true',
                'weight': 'bolder'
            }
        ],
        'actions': [
            {
                'type': 'Action.OpenUrl',
                'title': '{{More information}}',
                'url': '{{Url}}'
            },
            {
                'type': 'Action.Submit',
                'title': '{{Subscribe}}',
                'data': '{{subscribesentence}}'
            }
        ]
    }
}";
            //JObject json = JObject.Parse(jsonString);
            AdaptiveCardParseResult result = AdaptiveCard.FromJson(json);

            AdaptiveCard card2 = result.Card;
            Attachment attachment2 = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card
            };

            var replyToConversation2 = context.MakeMessage();
            replyToConversation.Attachments.Add(attachment2);
            await context.PostAsync(replyToConversation2);
            context.Wait(MessageReceivedAsync);
        }

        public async Task AfterResetAsync(IDialogContext context, IAwaitable<bool> argument)
        {
            var confirm = await argument;
            if (confirm)
            {
                this.count = 1;
                await context.PostAsync("Reset count.");
            }
            else
            {
                await context.PostAsync("Did not reset count.");
            }
            context.Wait(MessageReceivedAsync);
        }

        public string LoadJson() {
            using (StreamReader r = new StreamReader("file.json"))
            {
                string json = r.ReadToEnd();
                return json;
            }
        }
    }
}