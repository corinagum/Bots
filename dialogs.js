// initialize botbuilder framework
const BUILDER = require('botbuilder');
const HELPER = require('./helper.js');
// BOOKS is name of diaolog, user initiates dialog
exports.BOOKS = [
// session is global object, passed between dialogs
	function(session, results, next) {
		if(session.userData.book || session.userData.booklist){
			next();
		}
		else {
			BUILDER.Prompts.confirm(session, 'Looking for a new book?');
		}
	}, 
	function (session, results, next) {
		if(!results.response && !session.userData.book && !session.userData.booklist) {
			session.endDialog('Ok, come back another time!');
		}
		else if(session.userData.booklist){
			next();
		}
		else {
			BUILDER.Prompts.text(session, 'What genre are you interested in?\n Fantasy\n Non-Fiction\n History\n Sci-Fi\n You can also type "end" to cancel');
		}

	}, 
	function(session, results) {
		
		results.response = session.userData.booklist ? session.userData.booklist : results.response;
		if(results.response == 'Fantasy'){
			session.userData.booklist = HELPER.books.fantasy;
		}
		else if(results.response == 'Non-Fiction'){
			session.userData.booklist = HELPER.books.nonfiction;
		}
		else if(results.response == 'History'){
			session.userData.booklist = HELPER.books.history;
		}
		else if(results.response == 'Sci-Fi'){
			session.userData.booklist = HELPER.books.scifi;
		}
		else if(results.response == 'end') {
			session.endDialog('Ok, come back another time!');
		}

			
		if(session.userData.booklist) {
			session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
			BUILDER.Prompts.confirm(session, 'Why don\'t you try ' + session.userData.book + '?');
		} 
		else if(results.response != 'end') {
			BUILDER.Prompts.text(session, 'Sorry, I\'m a severely limited bot. Please pick from the following genres:\n Fantasy\n Non-Fiction\n History\n Sci-Fi');			
		}
			
		

	},
	function(session, results) {
		switch(results.response) {
			case 'end':
				session.endDialog('Ok, come back another time!');
				break;
			case true:
				let temp = session.userData.book
				session.userData.booklist = null;
				session.userData.book = null;
				session.endDialog('Great! Have fun reading ' + temp);
				break;
			case false:
				session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
				session.beginDialog('/picker');
				break;
			default:
				if(results.response == 'Fantasy'){
					session.userData.booklist = HELPER.books.fantasy;
				}
				else if(results.response == 'Non-Fiction'){
					session.userData.booklist = HELPER.books.nonfiction;
				}
				else if(results.response == 'History'){
					session.userData.booklist = HELPER.books.history;
				}
				else if(results.response == 'Sci-Fi'){
					session.userData.booklist = HELPER.books.scifi;
				}

				if(session.userData.booklist) {
					session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
					BUILDER.Prompts.confirm(session, 'Why don\'t you try ' + session.userData.book + '?');
				} 
				else {
					BUILDER.Prompts.text(session, 'Sorry, I\'m a severely limited bot. Please pick from the following genres:\n Fantasy\n Non-Fiction\n History\n Sci-Fi');
				}
				break;
		}
	},
	function(session, results) {
		switch(results.response) {
			case 'end':
				session.endDialog('Ok, come back another time!');
				break;
			case true:
				let temp = session.userData.book
				session.userData.booklist = null;
				session.userData.book = null;
				session.endDialog('Great! Have fun reading ' + temp);
				break;
			case false:
				session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
				session.beginDialog('/picker');
				break;
			default:
				let args = results.response;
				session.userData.booklist = results.response;
				session.beginDialog('/', args);	
				break;
		}
	}
];