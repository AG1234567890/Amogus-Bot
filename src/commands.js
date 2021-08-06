const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
 if (error) {
	console.log(error)
 return console.log('Unable to connect to database!')

 }
 const db = client.db(databaseName)
 console.log("Connected to the database at "+connectionURL)
 // Start to interact with the database
})
//I HAVE NO IDEA WHAT THE FUCK IM DOING
const { Client, Intents } = require('discord.js');
const config = require('dotenv').config()

const TOKEN = process.env.token

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
	console.log('Logged in!');
});

client.login(process.env.TOKEN);

// app.listen(3040, "localhost", function() {
// 	console.log("Server started.......");
//   });