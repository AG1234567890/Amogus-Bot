const Sequelize = require('sequelize');
const { Client, Intents } = require('discord.js');
const dotenv = require("dotenv")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fetch = require("node-fetch")

const prefix = "sus "

/*
 * Make sure you are on at least version 5 of Sequelize! Version 4 as used in this guide will pose a security threat.
 * You can read more about this issue on the [Sequelize issue tracker](https://github.com/sequelize/sequelize/issues/7310).
 */

const getQuote = () => {
	return fetch("https://zenquotes.io/api/random")
	  .then(res => {
		return res.json()
		})
	  .then(data => {
		return data[0]["q"] + " -" + data[0]["a"]
	  })
  }

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

client.once('ready', () => {
	/*
	 * equivalent to: CREATE TABLE tags(
	 * name VARCHAR(255),
	 * description TEXT,
	 * username VARCHAR(255),
	 * usage_count INT NOT NULL DEFAULT 0
	 * );
	 */
	Tags.sync();
	console.log("Bot has Logged In")
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
	
	if (command === "inspire") {
		getQuote().then(quote => message.channel.send(quote))
	}

	
});

client.login("");