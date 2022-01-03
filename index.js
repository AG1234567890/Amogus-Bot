const dotenv = require("dotenv");

dotenv.config()



const { Collection, Formatters, Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const discord = require ("discord.js")

const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.once("ready", async () => {
    console.log("The bot has connected.")
    client.user.setStatus('dnd');
    client.user.setActivity('your internet activity', { type: 'WATCHING' });
})

client.on("message", async (message) => {

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