using System;
using System.Threading.Tasks;

using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using System.Net.Http;
using AdaptiveCards;
using System.Collections.Generic;

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
            
            // return our reply to the user
            //await context.PostAsync(replyToConversation);
            await context.PostAsync("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
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

    }
}