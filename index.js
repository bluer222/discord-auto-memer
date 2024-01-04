const { Client, Events, GatewayIntentBits } = require("discord.js");
const https = require("https");
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
console.log("getting dictionary");
var dictionary = fs.readFileSync("./words.txt", "utf8").split("\n");
console.log(dictionary);

client.on("messageCreate", (message) => {
  // Check if the message author is not the bot itself
  if (message.author.bot) return;
  console.log("Message received:", message.content);
  var words = message.content.split(" ");
  var search = ["meme"];
  words.forEach(function (word, index) {
    if (dictionary.includes(word.toLowerCase())) {
    } else {
      search.push(words[index]);
      search.push(words[index - 1]);
      search.push(words[index + 1]);
    }
  });
  search = search.filter((value) => value !== undefined);
  console.log(search);
  if (search.length > 1) {
    fetch(
      "https://www.googleapis.com/customsearch/v1?q=" +
        search +
        "&cx=f5fde0317a3754392&key=" +
        process.env.googleapi +
        "&searchType=image",
    )
      .then((response) => response.json()) // Parse JSON when response arrives
      .then((data) => {
        const results = data.items; // Log the parsed data\
        results.forEach(function (result, index) {
            if(index < 3){
          message.channel.send(result.link);
            }
        });
      });
  }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
