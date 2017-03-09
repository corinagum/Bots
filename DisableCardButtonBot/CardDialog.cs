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
                var message = await argument;
                var reply = context.MakeMessage();
                reply.Attachments = new List<Attachment>();
                var ButtonList = new List<CardAction>
                    {
                        new CardAction(ActionTypes.OpenUrl, "Get Started", value: "https://github.com/Microsoft/BotBuilder-Samples/blob/master/CSharp/cards-RichCards/CardsDialog.cs"),
                        new CardAction(ActionTypes.ShowImage, "Very Polite", "")
                    };
                var Card = new HeroCard()
                {
                    Title = "Select an Action",
                    Subtitle = "Choose from available actions",
                    Text = "If you were polite and said \'hi\' or \'hello\' to this bot, you will see two buttons below.",
                    Images = new List < CardImage > { new CardImage("https://cloud.githubusercontent.com/assets/14900841/23733811/c618e402-042f-11e7-9b8e-6262d9f2d898.JPG") },
                };
                Card.Buttons = ButtonList;
                if(userdata.GetProperty<bool>("SentGreeting"))
                {

                }
                Attachment myAttachment = Card.ToAttachment();
           
                reply.Attachments.Add(myAttachment);

                await context.PostAsync(reply); //same as session.send
                context.Wait(MessageReceivedAsync);
         
            }
        }
}
