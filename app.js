const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [ GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'], 
});
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


client.on('messageCreate', (message) => {
  console.log(message);
  // Check if the message author is not the bot itself
  if (message.author.bot) return;

  // Echo back the message content
  message.channel.send(message.content);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);