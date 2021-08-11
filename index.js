const Sequelize = require("sequelize");
const randomPuppy = require('random-puppy');
const dotenv = require("dotenv");

const fetch = require("node-fetch");
const { Op } = require("sequelize");
const { Collection, Formatters, Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const discord = require ("discord.js")
const { Users, CurrencyShop } = require("./dbObjects");

const prefix = "sus ";
const workedRecently = new Set();
const stolenRecently = new Set()
const beggedRecently = new Set()
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const currency = new Collection();

const splice = (target) => {
  target = target.replace( "<", ''); // replace all leading non-digits with nothing
  target = target.replace( "@", '');
  target = target.replace( "!", '');
  target = target.replace( ">", '');
  return target
}

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
  client.user.setStatus('dnd');
  client.user.setActivity('Amogus', { type: 'WATCHING' });
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

		 let target = args[0] ;
    target = splice(target)

	console.log(args[0], "   bal   ", )
    return message.reply(
      `The hooman has ${currency.getBalance(target)} SusCoins 💸 `
    );
  } else if (command === "inventory") {
    let target =   message.author;


    const user = await Users.findOne({ where: { user_id: target.id } });

    const items = await user.getItems();

    if (!items.length) return message.reply(`${target.tag} has nothing!`);
    return message.reply(
      `${target.tag} currently has ${items
        .map((i) => `${i.amount} ${i.item.name}`)
        .join(", ")}`
    );
  } else if (command === "transfer" && args.length === 2) {
    const currentAmount = currency.getBalance(message.author.id);
	console.log(args)
    const transferAmount = args[0]//.getInteger("amount");
    const transferTarget = splice(args[1])//.getUser("user");
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
    currency.add(message.author.id, -transferAmount);
    currency.add(transferTarget, transferAmount);
	

    return message.reply(
      `Successfully transferred ${transferAmount}💰 to ${
        args[1]
      }. Your current balance is ${currency.getBalance(message.author.id)} 💰`
    );
	 

  } else if (command === "buy") {
    const itemName = args[0];
const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
if (!item) return message.reply(`That item doesn't exist.`);
if (item.cost > currency.getBalance(message.author.id)) {
	return message.reply(`You currently have ${currency.getBalance(+message.author.id)}, but the ${item.name} costs ${item.cost}!`);
}

const user = await Users.findOne({ where: { user_id: message.author.id } });
currency.add(message.author.id, -item.cost);
await user.addItem(item);

message.reply(`You've bought: ${item.name}.`);
  } else if (command === "shop") {
    const items = await CurrencyShop.findAll();
  return message.channel.send(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'));
  }  else if (command === "give-coins") {
    if (message.author.id == "574745164220727296") {
      currency.add(message.author.id, 1000000);
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
  currency.add(message.author.id, 25000);

  workedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after a minute
    workedRecently.delete(message.author.id);
  }, 24*60*60*1000);
}
  } else if (command === "steal") {
    if(message.mentions.members.first()) {
      let stealTarget = splice(args[0])
      if (currency.getBalance(stealTarget)<10000) {
        message.reply("The man is poor leave him alone")
      } else {
        if (stolenRecently.has(message.author.id)) {
          message.channel.send("Wait 10 minutes before robbing again - " + message.author.username);
  } else {
    const user = await Users.findOne({ where: { user_id: splice(stealTarget) } });

    const items = await user.getItems();
    console.log(items)
    const num = Math.floor(Math.random() * 11);
    currentBalance = currency.getBalance(message.author.id)
    targetBalance = currency.getBalance(stealTarget)
    currency.setBalance(message.author.id, Math.floor(targetBalance*0.09)+currentBalance )
    currency.setBalance(stealTarget, Math.floor(targetBalance*0.9))

    message.reply("You stole "+Math.floor(targetBalance*0.09)+" Coins!")
      
      stolenRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        stolenRecently.delete(message.author.id);
      }, 10*60000);
  }
      }
    }
  }//steal command
  else if (command === "beg") {

    if (beggedRecently.has(message.author.id)) {
      message.channel.send("Wait 3 Minutes before begging again! Just go rob someone lmfao - " + message.author.username);
}  else {
  beggedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after a minute
    beggedRecently.delete(message.author.id);
  }, 3*60000);
   const num = Math.floor(Math.random() * 2);
    if(num == 0) {
      const donors = ["An old man","A 30 Year Old Discord Mod","An Edgy Teenager","A Mutant Ninja Turtle","ur mom"]
      const DonorPick = Math.floor(Math.random()*5)
      const donateAmount = Math.floor(Math.random() * 500) + 500;
      message.reply(`${donors[DonorPick]} generously gave you ${donateAmount*3} coins!`)
      currency.add(+message.author.id, donateAmount*3)
    }  else {
      message.reply("No one gave you any coins 😔. Beg harder next time")
    }
}
    


  }

});
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix)) {
    currency.add(message.author.id, 250);
  }

  if (message.content.includes("amogus")) {
    message.channel.send("SUSSY AMOGUS WHEN THE IMPOSOTOR IS SUSSSY");
    message.react('😄');
  
  } else if (message.content.includes("based")) {
    message.channel.send(
      `${message.author} Based? Based on what? Your mom? Be more specific`
    );
  } else if (message.content.includes("sad")) {
    message.reply("cope harder")
  }
});

client.login(process.env.TOKEN);
