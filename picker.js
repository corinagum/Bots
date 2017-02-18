const BUILDER = require('botbuilder');
const HELPER = require('./helper.js');
module.exports.PICKER = [
	function(session, args){
		session.userData.booklist = args ? args.booklist : session.userData.booklist;
		session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
		session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
		BUILDER.Prompts.confirm(session, 'Why don\'t you try ' + session.userData.book + '?');	
	}, 
	function (session, results){
		if(results.response) {
			session.send('Great! Have fun reading ' + session.userData.book);
			session.userData.bookChosen = true;
			session.userData.entities = null;
			session.endConversation();
		}

		else if(session.userData.booklist.length < 1) {
			BUILDER.Prompts.confirm(session, 'Sorry, I\'m out of ideas. Want to try a different genre?');
		}
		else {
			session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
			BUILDER.Prompts.text(session, 'Why don\'t you try ' + session.userData.book + '?');	
		}
	}, 
	function(session, results) {
		if(results.response == 'end' || !results.response) {
			session.endDialog('Ok, come back another time!')
		}
		else if(results.response == 'yes') {
			session.send('Great! Have fun reading ' + session.userData.book);
			session.userData.bookChosen = true;
			session.userData.entities = null;
			session.endConversation();
		}

		else if(results.response == 'no') {
			session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
			session.replaceDialog('/picker', session.userData);
		}
		else if (results.response && session.userData.booklist.length < 1) {
			session.userData.booklist = null;
			session.replaceDialog('/PickBook');
		}
		else {
			HELPER.poorBot(session);	
		}
	}
]

