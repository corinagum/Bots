/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/
              require('dotenv').config();
var restify = require('restify');
const { builder, BotFrameworkAdapter, BotStateSet, ConversationState, MemoryStorage, TurnContext, UserState } = require('botbuilder');
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');
const { DialogSet } = require('botbuilder-dialogs');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat adapter for communicating with the Bot Framework Service
var adapter = new builder.BotFrameworkAdapter({
    appId: process.env.MICROSOFTAPPID,
    appPassword: process.env.MICROSOFTAPPPASSWORD,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// The corresponding LUIS application is `CombineWeatherAndLights`
const dispatcher = new LuisRecognizer({
    appId: '8c204fa3-1e7c-45fd-a67b-2479bc59591f',
    subscriptionKey: process.env.LUIS_SUBSCRIPTION_KEY_DISPATCH,
    serviceEndpoint: 'https://westus.api.cognitive.microsoft.com/',
    verbose: true
});

// The corresponding LUIS application is `homeautomation`
const homeAutomation = new LuisRecognizer({
    appId: 'c86f6f3b-0613-468b-83fa-789dbe954e58',
    subscriptionKey: process.env.LUIS_SUBSCRIPTION_KEY_HOMEAUTO,
    serviceEndpoint: 'https://westus.api.cognitive.microsoft.com/',
    verbose: true
});

const faq = new QnAMaker(
    {
        knowledgeBaseId: '952f4335-a704-4d0a-98b4-c3b3f7533122',
        endpointKey: process.env.QNA_SUBSCRIPTION_KEY,
        host: 'https://v-corgumSmartLightFAQ.azurewebsites.net/qnamaker'
    },
    {
        answerBeforeNext: true
    }
);


/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot.
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Add state middleware
const storage = new MemoryStorage();
const convoState = new ConversationState(storage);
const userState = new UserState(storage);
adapter.use(new BotStateSet(convoState, userState));

// Register some dialogs for usage with the LUIS apps that are being dispatched to
const dialogs = new DialogSet();

//Helper function to retrieve specific entities from LUIS results
function findEntities(entityName, entityResults) {
    let entities = [];
    if(entityName in entityResults) {
        entityResults[entityName].forEach(entity => {
            entities.push(entity);
        });
    }
    return entities.length > 0 ? entities : undefined;
}

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(adapter);
bot.set('storage', tableStorage);

bot.dialog('/', function (session) {
    session.send('You said ' + session.message.text);
});

dialogs.add('HomeAutomation_TurnOff', [
    async (dialogContext, args) => {
        const devices = findEntities('HomeAutomation_Device', args.entities);
        const operations = findEntities('HomeAutomation_Operation', args.entities);

        const state = convoState.get(dialogContext.context);
        state.homeAutomationTurnOff = state.homeAutomationTurnOff ? state.homeAutomationTurnOff + 1 : 1;

        await dialogContext.context.sendActivity(`${state.homeAutomationTurnOff}: You reached the "HomeAutomation_TurnOff" dialog.`);

        if(devices) {
            await dialogContext.context.sendActivity(`Found these "HomeAutomation_Device" entities: \n ${devices.join(', ')}`);
        }

        if(operations) {
            await dialogContext.context.sendActivity(`Found these "HomeAutomation_Operation" entities: \n ${operations.join(', ')}`);
        }

        await dialogContext.end();
    }
]);

dialogs.add('HomeAutomation_TurnOn', [
    async (dialogContext, args) => {
        const devices = findEntities('HomeAutomation_Device', args.entities);
        const operations = findEntities('HomeAutomation_Operation', args.entities);

        const state = convoState.get(dialogContext.context);
        state.homeAutomationTurnOn = state.homeAutomationTurnOn ? state.homeAutomationTurnOn + 1 : 1;
        await dialogContext.context.sendActivity(`${state.homeAutomationTurnOn}: You reached the "HomeAutomation_TurnOn" dialog.`);
        if(devices) {
            await dialogContext.context.sendActivity(`Found these "HomeAutomation_Device" entities: \n ${devices.join(', ')}`);
        }

        if(operations) {
            await dialogContext.context.sendActivity(`Found these "HomeAutomation_Operation" entities: \n ${operations.join(', ')}`);
        }

        await dialogContext.end();
    }
]);

dialogs.add('None', [
    async (dialogContext) => {
        const state = convoState.get(dialogContext.context);
        state.noneIntent = state.noneIntent ? state.noneIntent + 1 : 1;
        await dialogContext.context.sendActivity(`${state.noneIntent}: You reached the "None" dialog.`);
        await dialogContext.end();
    }
]);

adapter.use(dispatcher);

// Listen for incoming Activities
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type === 'message') {
            const state = convoState.get(context);
            const dc = dialogs.createContext(context, state);

            // Retrieve the LUIS results from our dispatcher LUIS application

            const luisResults = dispatcher.get(context);

            // Extract the top intent from LUIS and use it to select which LUIS application to dispatch to
            const topIntent = LuisRecognizer.topIntent(luisResults);

            const isMessage = context.activity.type === 'message';
            if(isMessage) {
                switch (topIntent) {
                    case 'l_homeautomation':
                    const homeAutoResults = await homeAutomation.recognize(context);
                    const topHomeAutoIntent = LuisRecognizer.topIntent(homeAutoResults);
                    await dc.begin(topHomeAutoIntent, homeAutoResults);
                    break;
                    case 'q_faq':
                    await faq.answer(context);
                    break;
                    default: await dc.begin('None');
                }
            }
        }

        if (!context.responded) {
            await dc.continue();
            if(!context.responded && isMessage) {
                await dc.context.sendActivity(`Hi! I'm the LUIS dispatch bot. Say something and LUIS will decide how the message should be routed`);
            }
        }
    });
});
