// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Threading.Tasks;
using Microsoft.Bot;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Builder.Ai.LUIS;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Choices;
using System.Collections.Generic;
using Microsoft.Recognizers.Text;
using System.Linq;
using System.Text.RegularExpressions;

namespace PokemonGoBot
{
    public class PokemonGoBot : IBot
    {
        private const double LUIS_INTENT_THRESHOLD = 0.2d;

        private readonly DialogSet dialogs;

        public PokemonGoBot()
        {
            dialogs = new DialogSet();
            dialogs.Add("None", new WaterfallStep[] { DefaultDialog });
            dialogs.Add("Help", new WaterfallStep[] { AskReminderTitle, SaveReminder });
            dialogs.Add("Cancel", new WaterfallStep[] { ShowReminders, ConfirmShow });
            dialogs.Add("PokemonEffectivenessInfo", new TextPrompt(TitleValidator));
            dialogs.Add("TypeEffectiveness", new ChoicePrompt(Culture.English));
        }

        private async Task TitleValidator(ITurnContext context, TextResult result)
        {
            if (string.IsNullOrWhiteSpace(result.Value) || result.Value.Length < 3)
            {
                result.Status = PromptStatus.NotRecognized;
                await context.SendActivityAsync("Title should be at least 3 characters long.");
            }
        }

        private Task DefaultDialog(DialogContext dialogContext, object args, SkipStepFunction next)
        {
            return dialogContext.Context.SendActivityAsync("Hi! I'm a simple reminder bot. I can add reminders and show them.");
        }

        private async Task AskReminderTitle(DialogContext dialogContext, object args, SkipStepFunction next)
        {
            var reminder = new Reminder(dialogContext.ActiveDialog.State);
            dialogContext.ActiveDialog.State = reminder;
            if (!string.IsNullOrEmpty(reminder.Title))
            {
                await dialogContext.Continue();
            }
            else
            {
                await dialogContext.Prompt("TitlePrompt", "What would you like to call your reminder?");
            }
        }

        private async Task SaveReminder(DialogContext dialogContext, object args, SkipStepFunction next)
        {
            var reminder = new Reminder(dialogContext.ActiveDialog.State);
            if (args is TextResult textResult)
            {
                reminder.Title = textResult.Value;
            }
            await dialogContext.Context.SendActivityAsync($"Your reminder named '{reminder.Title}' is set.");
            var userContext = dialogContext.Context.GetUserState<UserState>();
            userContext.Reminders.Add(reminder);
            await dialogContext.End();
        }

        private async Task ShowReminders(DialogContext dialogContext, object args, SkipStepFunction next)
        {
            var userContext = dialogContext.Context.GetUserState<UserState>();
            if (userContext.Reminders.Count == 0)
            {
                await dialogContext.Context.SendActivityAsync("No reminders found.");
                await dialogContext.End();
            }
            else
            {
                var choices = userContext.Reminders.Select(x => new Choice() { Value = x.Title.Length < 15 ? x.Title : x.Title.Substring(0, 15) + "..." }).ToList();
                await dialogContext.Prompt("ShowReminderPrompt", "Select the reminder to show: ", new ChoicePromptOptions() { Choices = choices });
            }
        }

        private async Task ConfirmShow(DialogContext dialogContext, object args, SkipStepFunction next)
        {
            var userContext = dialogContext.Context.GetUserState<UserState>();
            if (args is ChoiceResult choice)
            {
                var reminder = userContext.Reminders[choice.Value.Index];
                await dialogContext.Context.SendActivityAsync($"Reminder: {reminder.Title}");
            }
            await dialogContext.End();
        }
        
        public async Task OnTurnAsync(ITurnContext context)
        {
            switch(context.Activity.Type)
            {
                // On "ConversationUpdate" - greeting message
                case ActivityTypes.ConversationUpdate: 
                    var newUserName = context.Activity.MembersAdded.FirstOrDefault()?.Name;
                    if(!string.IsNullOrWhiteSpace(newUserName) && newUserName != "Bot")
                    {
                        await context.SendActivityAsync($"Hello {newUserName}! Welcome to the Pokemon Go Bot.");
                    }
                    break;
                case ActivityTypes.Message:
                    await context.SendActivityAsync("Welcome to the Pokemon Go Bot!");
                    break;

            }
            await Task.CompletedTask;
            
            //if (context.Activity.Type == ActivityTypes.ConversationUpdate && context.Activity.MembersAdded.FirstOrDefault()?.Id == context.Activity.Recipient.Id)
            //{
            //    await context.SendActivity("Hi! I'm a simple reminder bot. I can add reminders and show them.");
            //}
            //else if (context.Activity.Type == ActivityTypes.Message)
            //{
            //    var userState = context.GetUserState<UserState>();
            //    if (userState.Reminders == null)
            //    {
            //        userState.Reminders = new List<Reminder>();
            //    }

            //    var state = context.GetConversationState<Dictionary<string, object>>();
            //    var dialogContext = dialogs.CreateContext(context, state);

            //    var utterance = context.Activity.Text.ToLowerInvariant();
            //    if (utterance == "cancel")
            //    {
            //        if (dialogContext.ActiveDialog != null)
            //        {
            //            await context.SendActivity("Ok... Cancelled");
            //            dialogContext.EndAll();
            //        }
            //        else
            //        {
            //            await context.SendActivity("Nothing to cancel.");
            //        }
            //    }
                
            //    if (!context.Responded)
            //    {
            //        await dialogContext.Continue();

            //        if (!context.Responded)
            //        {
            //            var luisResult = context.Services.Get<RecognizerResult>(LuisRecognizerMiddleware.LuisRecognizerResultKey);
            //            var (intent, score) = luisResult.GetTopScoringIntent();
            //            var intentResult = score > LUIS_INTENT_THRESHOLD ? intent : "None";

            //            await dialogContext.Begin(intent);
            //        }
            //    }
            //}
        }
    }
}
