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
		fantasy:['Game of Thrones by George R.R. Martin', 'The Fellowship of the Ring, by J.R.R. Tolkien', 'The Name of the Wind, by Patrick Rothfuss', 'Shadow and Bone, by Leigh Bardugo'],
		nonfiction:['The Immortal Life of Henrietta Lacks, by Rebecca Skloot', 'Blink: The Power of Thinking Without Thinking, by Malcolm Gladwell', 'Night, by Elie Wiesel', 'Stiff: The Curious Lives of Human Cadavers, by Mary Roach'],
		history:['1776, by David McCullough', 'Unbroken: A World Warr II Story of Survival, Resilience, and Redemption, by Laura Hillenbrand', 'A Short History of Nearly Everything, by Bill Bryson', 'Night, by Elie Wiesel'],
		scifi: ['Three Years with the Rat, by Jay Hosking', 'The Hitchhiker\'s Guide to the Galaxy, by Douglas Adams', 'Dune, by Frank Herbert', 'Ender\'s Game, by Orson Scott Card']
	}
}