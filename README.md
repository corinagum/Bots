# MSFTBot: What should I read?
Please note that I included the node_modules directory, so download may take longer than usual. This is for ease of use for the user. :)
## To Run: 
1. Please add provided config.js file to configure LUIS, or see config-sample.js to create new LUIS keys.
1. in the console, start the app by typing `node app.js`
1. Say 'hi' to the bot!
1. Answer its questions
## What this Bot Does
This bot is intended to help the user decide on a new book to read by selecting the genre of the book.
## What this Bot Contains
* MSFT Bot Framework
* Written with Node.js
* LUIS
## How I would improve this app
* Continue refactoring, especially dialogs.js (last three waterfall steps are not quite DRY)
* Integrate [Goodreads](http://goodreads.com/) [API](http://goodreads.com/api) so that genres are unlimited
