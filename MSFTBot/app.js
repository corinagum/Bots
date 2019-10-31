// initialize botbuilder framework
const BUILDER = require('botbuilder');
const HELPER = require('./helper.js');
const CONFIG = require('./config.js')
// listening to console
const CONNECTOR	 = new BUILDER.ConsoleConnector().listen();
let model = 'https://' + CONFIG.LUIS_URL + CONFIG.LUIS_KEYS;
let recognizer = new BUILDER.LuisRecognizer(model);
let dialog = new BUILDER.IntentDialog({recognizers: [recognizer]});
// create bot
const BOT = new BUILDER.UniversalBot(CONNECTOR);

//importing books waterfall
const BOOKS = require('./dialogs.js')(BUILDER);
const PICKER = require('./picker.js').PICKER;

BOT.dialog('/', dialog);

dialog.matches('PickBook',
	function(session, results){
		session.beginDialog('/PickBook', results);
	}
);

dialog.matches('Greetings',
	function(session, results) {
		session.beginDialog('/Greetings', results)
	}
);

BOT.dialog('/Greetings', 	
	[function(session, results){
		BUILDER.Prompts.confirm(session, 'Hi, want help selecting a book?');
	}, 
	function(session, results){
		if(results.response) {
			session.userData.greetings = true;
			session.beginDialog('/PickBook');
		}
		else {
			BUILDER.DialogAction.endDialog();
		}

	}]);
BOT.dialog('/PickBook', BOOKS);
BOT.dialog('/picker', PICKER);

dialog.onDefault(BUILDER.DialogAction.beginDialog('/Greetings'));