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
			var message = await argument as Activity;

			Activity reply = message.CreateReply("Buttons");
			//Do I want to keep this?
			//reply.AttachmentLayout = AttachmentLayoutTypes.List;
			//reply.Attachments = new List<Attachment>();
			//
			var card = GetThumbnailCard();
			Attachment cardAttachment = card.ToAttachment();

			reply.Attachments.Add(cardAttachment);

			await context.PostAsync(reply);
	
		}

		private static ThumbnailCard GetThumbnailCard()
		{
			List<CardAction> cardButtons = new List<CardAction>();
			CardAction plButton1 = new CardAction()
			{
				Value = "is",
				Type = "postBack",
				Title = "IS Services",
				Text = "is",
			};
			CardAction plButton2 = new CardAction()
			{
				Value = "erp",
				Type = "postBack",
				Title = "ERP Process",
				Text = "erp"
			};
			CardAction plButton3 = new CardAction()
			{
				Value = "retail",
				Type = "postBack",
				Title = "RETAIL",
				Text = "retail"
			};
			CardAction plButton4 = new CardAction()
			{
				Value = "hr",
				Type = "postBack",
				Title = "HR Policy",
				Text = "hr"
			};
			CardAction plButton5 = new CardAction()
			{
				Value = "I want to log an it call",
				Type = "postBack",
				Title = "Log a case in ***",
				Text = "Transaction"
			};
			cardButtons.Add(plButton1);
			cardButtons.Add(plButton2);
			cardButtons.Add(plButton3);
			cardButtons.Add(plButton4);
			cardButtons.Add(plButton5);


			var heroCard = new ThumbnailCard
			{
				Title = "BotFramework Thumbnail Card",
				Subtitle = "Microsoft Bot Framework",
				Text = "Build and connect intelligent bots to interact with your users naturally wherever they are," +
					   " from text/sms to Skype, Slack, Office 365 mail and other popular services.",
				Images = new List<CardImage> { new CardImage("https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg") },
				Buttons = cardButtons,
			};
			return heroCard;
		}

	}
}