// initialize botbuilder framework
const BUILDER = require('botbuilder');
// listening to console
const CONNECTOR	 = new BUILDER.ConsoleConnector().listen();
// create bot
const BOT = new BUILDER.UniversalBot(CONNECTOR);

//importing books waterfall
const BOOKS = require('./dialogs.js').BOOKS;
const PICKER = require('./picker.js').PICKER;

BOT.dialog('/', BOOKS);
BOT.dialog('/picker', PICKER);