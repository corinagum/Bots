// initialize botbuilder framework
const BUILDER = require('botbuilder');
const HELPER = require('./helper.js');
// BOOKS is name of diaolog, user initiates dialog
module.exports = function (BUILDER) {
	return [
	// session is global object, passed between dialogs
		function(session, results, next) {
			if(session.userData.bookChosen) {
				session.userData.booklist = null;
				session.userData.book = null;
			}
			if(session.userData.book || session.userData.booklist || session.userData.greetings || results) {
				if(results) {
					if(results.entities) {
						session.userData.entities = results.entities;
					}
				}
				
				next();
			}
			else if (!results.entities) {
				session.userData.booklist = null;
				BUILDER.Prompts.confirm(session, 'Looking for a new book?');
			} else {
				BUILDER.Prompts.confirm(session, 'Looking for a new book?');
			}
		}, 
		function (session, results, next) {
			if(!results.response && !session.userData.book && !session.userData.booklist && !session.userData.entities && !session.userData.greetings) {
				session.endDialog('Ok, come back another time!');
			}
			else if(session.userData.booklist || session.userData.entities){
				next();
			}
			else {
				BUILDER.Prompts.text(session, 'What genre are you interested in?\n Fantasy\n Non-Fiction\n History\n Sci-Fi\n You can also type "end" to cancel');
			}

		}, 
		function(session, results) {
			if (session.userData.entities) {
				results.response = session.userData.entities ? session.userData.entities[0]["type"] : results.response;
			}
			if(results.response == 'end'){
				session.endDialog('Ok, come back another time!');
			}
			else {
				HELPER.LUISCall(results.response)
				.then(function(res){
					let json = JSON.parse(res);
					
					let genre = json.entities[0]['type'];
					results.response = session.userData.booklist ? session.userData.booklist : genre;
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
				})
				.catch(function(reason) {
					HELPER.poorBot(session);
				})
			}
			
		},
		function(session, results) {
			switch(results.response) {
				case 'end':
					session.endDialog('Ok, come back another time!');
					break;
				case true:
					if(session.userData.book) {
						session.send('Great! Have fun reading ' + session.userData.book);		
					}
					session.userData.bookChosen = true;
					session.userData.entities = null;
					session.endConversation();
					break;
				case false:
					session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
					session.beginDialog('/picker');
					break;
				default:
					HELPER.LUISCall(results.response)
					.then(function(res){
						let json = JSON.parse(res);
						
						let genre = json.entities[0]['type'];
						results.response = session.userData.booklist ? session.userData.booklist : genre;
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
						// else if(results.response == 'end') {
						// 	session.endDialog('Ok, come back another time!');
						// }
						
						if(session.userData.booklist) {
							session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
							BUILDER.Prompts.confirm(session, 'Why don\'t you try ' + session.userData.book + '?');
						} 
					})
					.catch(function(reason) {
						HELPER.poorBot(session);
					})
					break;
			}
		},
		function(session, results) {
			switch(results.response) {
				case 'end':
					session.endDialog('Ok, come back another time!');
					break;
				case true:
					if(session.userData.book) {
						session.send('Great! Have fun reading ' + session.userData.book);		
					}
					session.userData.bookChosen = true;
					session.userData.entities = null;
					session.endDialog();
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
}