const BUILDER = require('botbuilder');
const HELPER = require('./helper.js');
exports.PICKER = [
	function(session, args){
		session.userData.booklist = args ? args.booklist : session.userData.booklist;
		session.userData.book = session.userData.booklist[Math.floor((Math.random() * session.userData.booklist.length))];
		session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
		BUILDER.Prompts.confirm(session, 'Why don\'t you try ' + session.userData.book + '?');	
	}, 
	function (session, results){
		if(results.response) {
			let temp = session.userData.book
			session.userData.booklist = null;
			session.userData.book = null;
			session.endDialog('Great! Have fun reading ' + temp);
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
			let temp = session.userData.book
			session.userData.booklist = null;
			session.userData.book = null;
			session.endDialog('Great! Have fun reading ' + temp);
		}

		else if(results.response == 'no') {
			session.userData.booklist = HELPER.removeFromList(session.userData.booklist, session.userData.book);
			session.replaceDialog('/picker', session.userData);
		}
		else if (results.response && session.userData.booklist.length < 1) {
			session.userData.booklist = null;
			session.replaceDialog('/');
		}
		else {
			BUILDER.Prompts.text(session, 'Sorry, I\'m a severely limited bot. Please pick from the following genres:\n Fantasy\n Non-Fiction\n History\n Sci-Fi');	
		}
	}
]

