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
const config = require('dotenv').config()
const fetch = require("node-fetch")
const prefix= "sus "
const Discord = require("discord.js")
const client = new Discord.Client()


const getQuote = () => {
	return fetch("https://zenquotes.io/api/random")
	  .then(res => {
		return res.json()
		})
	  .then(data => {
		return data[0]["q"] + " -" + data[0]["a"]
	  })
  }

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.content === prefix+"inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }
})


client.login(process.env.TOKEN);

