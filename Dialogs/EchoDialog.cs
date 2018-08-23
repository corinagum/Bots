using System;
using System.Threading.Tasks;

using Microsoft.Bot.Connector;
using Microsoft.Bot.Builder.Dialogs;
using System.Net.Http;
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
            var message = await argument;

            if (message.Text == "reset")
            {
                PromptDialog.Confirm(
                    context,
                    AfterResetAsync,
                    "Are you sure you want to reset the count?",
                    "Didn't get that!",
                    promptStyle: PromptStyle.Auto);
            }
            else
            {
				IMessageActivity replyToConversation = context.MakeMessage();
				replyToConversation.Text = "Should go to conversation, in carousel format";

				replyToConversation.AttachmentLayout = AttachmentLayoutTypes.Carousel;
                replyToConversation.Attachments = new List<Attachment>();
                
                Dictionary<string, string> cardContentList = new Dictionary<string, string>();
                cardContentList.Add("PigLatin", "https://<ImageUrl1>");
                cardContentList.Add("Pork Shoulder", "https://<ImageUrl2>");
                cardContentList.Add("Bacon", "https://<ImageUrl3>");
                
                foreach(KeyValuePair<string, string> cardContent in cardContentList)
                {
                    List<CardImage> cardImages = new List<CardImage>();
                    cardImages.Add(new CardImage(url:cardContent.Value ));
                
                    List<CardAction> cardButtons = new List<CardAction>();
                
                    CardAction plButton = new CardAction()
                    {
                        Value = $"https://en.wikipedia.org/wiki/{cardContent.Key}",
                        Type = "openUrl",
                        Title = "WikiPedia Page"
                    };
                
                    cardButtons.Add(plButton);
                
                    HeroCard plCard = new HeroCard()
                    {
                        Title = $"I'm a hero card about {cardContent.Key}",
                        Subtitle = $"{cardContent.Key} Wikipedia Page",
                        Images = cardImages,
                        Buttons = cardButtons
                    };
                
                    Attachment plAttachment = plCard.ToAttachment();
                    replyToConversation.Attachments.Add(plAttachment);
                }
                
                await context.PostAsync(replyToConversation);
                context.Wait(MessageReceivedAsync);
			}
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