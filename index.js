const Sequelize = require('sequelize');

const dotenv = require("dotenv")

const fetch = require("node-fetch")
const { Op } = require('sequelize');
const { Collection, Formatters, Client, Intents } = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects');
const prefix = "sus "
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const currency = new Collection();

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});



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

client.once('ready', async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log("Bot has Logged In")
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
	
	if (command === "inspire") {
		getQuote().then(quote => message.channel.send(quote))
	} else if (command === "bal") {
		const target = message.author;
return message.reply(`${target.tag} has ${currency.getBalance(target.id)} SusCoins 💸`);
	}  else if (command === 'inventory') {
		// [delta]
	} else if (command === 'transfer') {
		// [epsilon]
	} else if (command === 'buy') {
		// [zeta]
	} else if (command === 'shop') {
		// [theta]
	} else if (command === 'leaderboard') {
		// [lambda]
	}

	
});
client.on("message", async message => {
	if (!message.content.startsWith(prefix)){
			currency.add(message.author.id, 5);
	}

	if (message.content.includes("amogus")){
		message.channel.send("SUSSY AMOGUS WHEN THE IMPOSOTOR IS SUSSSY")
	} else if (message.content.includes("based")){
		message.channel.send(`${message.author} Based? Based on what? Your mom? Be more specific`)
	}
})

client.login("ODczMDcwNjEwMDU2NjMwMzI0.YQzEXg.NhJTTaxQEoziDXTQyR-CoEO6qUU");