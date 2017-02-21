// consists of helper data & methods for the bot
const CONFIG = require('./config.js');
const BUILDER = require('botbuilder');
module.exports = {
	removeFromList: function (list, book) {
	for(var i = list.length; i>=0; i--) {
		if(list[i] == book) {
			list.splice(i,1);
		}
	}
		return list;
	},
	books: {
		genres: ['Fantasy', 'Non-Fiction', 'History', 'Sci-Fi'],
		fantasy:['Game of Thrones, by George R.R. Martin', 'The Fellowship of the Ring, by J.R.R. Tolkien', 'The Name of the Wind, by Patrick Rothfuss', 'Shadow and Bone, by Leigh Bardugo'],
		nonfiction:['The Immortal Life of Henrietta Lacks, by Rebecca Skloot', 'Blink: The Power of Thinking Without Thinking, by Malcolm Gladwell', 'Night, by Elie Wiesel', 'Stiff: The Curious Lives of Human Cadavers, by Mary Roach'],
		history:['1776, by David McCullough', 'Unbroken: A World Warr II Story of Survival, Resilience, and Redemption, by Laura Hillenbrand', 'A Short History of Nearly Everything, by Bill Bryson', 'Night, by Elie Wiesel'],
		scifi: ['Three Years with the Rat, by Jay Hosking', 'The Hitchhiker\'s Guide to the Galaxy, by Douglas Adams', 'Dune, by Frank Herbert', 'Ender\'s Game, by Orson Scott Card']
	},
	LUISCall: function(request) {
		let options = {
			host: CONFIG.LUIS_URL,
			path: CONFIG.LUIS_KEYS + "&q=" + request.replace(/ /g, '%20')	
		};
		let response = "";

		return new Promise(function(resolve, reject){
			let request = require("https").request(options, function(res){
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					response += chunk;
				});
				res.on('error', function(err){
					return reject(err);
				});
				res.on('end', function(){
					if(!response) {
						return resolve('');
					}
					return resolve(response);
				});
			}).end()
		})
	}, 
	poorBot: function (session) {
		BUILDER.Prompts.text(session, 'Sorry, I\'m a severely limited bot. Please pick from the following genres:\n Fantasy\n Non-Fiction\n History\n Sci-Fi'
		)},
}