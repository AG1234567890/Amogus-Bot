const Sequelize = require("sequelize");
const randomPuppy = require('random-puppy');
const dotenv = require("dotenv");

const fetch = require("node-fetch");
const { Op } = require("sequelize");
const { Collection, Formatters, Client, Intents } = require("discord.js");
const { Users, CurrencyShop } = require("./dbObjects");
const prefix = "sus ";
const workedRecently = new Set();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const currency = new Collection();

Reflect.defineProperty(currency, "add", {
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

Reflect.defineProperty(currency, "getBalance", {
  /* eslint-disable-next-line func-name-matching */
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

Reflect.defineProperty(currency, "setBalance", {
  value: function setBalance(id, amount) {
    const user = currency.get(id)
    user.balance = Number(amount);
    return user.save();
  }
})

const getQuote = () => {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
};

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

// const Tags = sequelize.define('tags', {
// 	name: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	},
// 	description: Sequelize.TEXT,
// 	username: Sequelize.STRING,
// 	usage_count: {
// 		type: Sequelize.INTEGER,
// 		defaultValue: 0,
// 		allowNull: false,
// 	},
// });

client.once("ready", async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach((b) => currency.set(b.user_id, b));
  console.log("Bot has Logged In");
  client.user.setPresence({
    activities: [{ name: " with amogus" }],
    status: "idle",
  });
});

// client.on('messageCreate', async message => {
// 	if (message.author.bot) return;
// 	currency.add(message.author.id, 1);
// });

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "inspire") {
    getQuote().then((quote) => message.channel.send(quote));
  } else if (command === "bal" && args.length == 1) {

		 const target = args[0] ;



	console.log(args[0], "   bal   ", )
    return message.reply(
      `${target} has ${currency.getBalance(target)} SusCoins 💸 `
    );
  } else if (command === "inventory") {
    const target =   message.author;

    const user = await Users.findOne({ where: { user_id: "<@!"+target.id+">" } });

    const items = await user.getItems();

    if (!items.length) return message.reply(`${target.tag} has nothing!`);
    return message.reply(
      `${target.tag} currently has ${items
        .map((i) => `${i.amount} ${i.item.name}`)
        .join(", ")}`
    );
  } else if (command === "transfer" && args.length === 2) {
    const currentAmount = currency.getBalance("<@!"+message.author.id+">");
	console.log(args)
    const transferAmount = args[0]//.getInteger("amount");
    const transferTarget = args[1]//.getUser("user");
	console.log(args)
	console.log(args[1], "   args      ",args[1].id)
    if (transferAmount > currentAmount)
      return message.reply(
        `Sorry ${message.author}, you only have ${currentAmount}.`
      );
    if (transferAmount <= 0)
      return message.reply(
        `Please enter an amount greater than zero, ${message.author}.`
      );
	if (!typeof(transferAmount) == "number"){
		return message.reply("Bruh No")
	}
    currency.add("<@!"+message.author.id+">", -transferAmount);
    currency.add(transferTarget, transferAmount);
	

    return message.reply(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget
      }. Your current balance is ${currency.getBalance("<@!"+message.author.id+">")}💰`
    );
	 

  } else if (command === "buy") {
    const itemName = args[0];
const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
if (!item) return message.reply(`That item doesn't exist.`);
if (item.cost > currency.getBalance("<@!"+message.author.id)+">") {
	return message.reply(`You currently have ${currency.getBalance("<@!"+message.author.id+">")}, but the ${item.name} costs ${item.cost}!`);
}

const user = await Users.findOne({ where: { user_id: "<@!"+message.author.id+">" } });
currency.add("<@!"+message.author.id+">", -item.cost);
await user.addItem(item);

message.reply(`You've bought: ${item.name}.`);
  } else if (command === "shop") {
    const items = await CurrencyShop.findAll();
  return message.channel.send(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'));
  }  else if (command === "give-coins") {
    if (message.author.id == "574745164220727296") {
      currency.add("<@!"+message.author.id+">", 1000000);
      message.reply("You recieved 1,000,000 Coins");
    } else {
      message.reply("You are not an Admin");
    }
  } else if (command === "daily") {
    if (workedRecently.has(message.author.id)) {
      message.channel.send("Wait 24 Hours before getting your daily bonus again. - " + message.author.username);
} 
 else {
  
  message.reply(`You recieved 25000 Sus Coins`)
  currency.add("<@!"+message.author.id+">", 25000);

  workedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after a minute
    workedRecently.delete(message.author.id);
  }, 24*60*60*1000);
}
  } else if (command === "steal") {
    if(message.mentions.members.first()) {
      stealTarget = args[0]
      if (currency.getBalance(stealTarget)<10000) {
        message.reply("The man is poor leave him alone")
      }
    }
  }
});
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix)) {
    currency.add("<@!"+message.author.id+">", 10);
  }

  if (message.content.includes("amogus")) {
    message.channel.send("SUSSY AMOGUS WHEN THE IMPOSOTOR IS SUSSSY");
  } else if (message.content.includes("based")) {
    message.channel.send(
      `${message.author} Based? Based on what? Your mom? Be more specific`
    );
  }
});

client.login(process.env.TOKEN);
