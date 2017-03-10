using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Microsoft.Bot.Builder.Dialogs;
using System.Collections.Generic;
using System.Diagnostics;

namespace DisableCardButtonBot
{
    [Serializable]
    public class CardDialog : IDialog<object>
    {


        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }

        public async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> argument)
        {
            // create sentGreeting
            bool sentGreeting;
            // assign value from UserData.SentGreeting
            context.UserData.TryGetValue<bool>("SentGreeting", out sentGreeting);

            var message = await argument;
            var reply = context.MakeMessage();
            // create attachment
            reply.Attachments = new List<Attachment>();
            // create standard button list (for those who do not greet the bot)
            var GenericButtonList = new List<CardAction>
            {
                new CardAction(ActionTypes.OpenUrl, "Bot Framework", value: "https://docs.botframework.com/en-us/"),
            };

            // create the hero card
            var Card = new HeroCard()
            {
                Title = "Select an Action",
                Subtitle = "Choose from available actions",
                Text = "If you were polite and said \'hi\' or \'hello\' to this bot, you will see two buttons below.",
                Images = new List<CardImage> { new CardImage("https://cloud.githubusercontent.com/assets/14900841/23733811/c618e402-042f-11e7-9b8e-6262d9f2d898.JPG") },
                Buttons = GenericButtonList
            };
            // create secret button that only users who said hi can see
            CardAction secretButton = new CardAction();
            secretButton.Title = "Very Polite";
            secretButton.Type = "openUrl";
            secretButton.Value = "https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/demo-ContosoFlowers/ContosoFlowers.Services";

            if (sentGreeting)
            {
                Card.Buttons.Add(secretButton);
            }

            // create attachment to send with reply
            Attachment myAttachment = Card.ToAttachment();

            reply.Attachments.Add(myAttachment);

            await context.PostAsync(reply);
            context.Wait(MessageReceivedAsync);

        }
    }
}
