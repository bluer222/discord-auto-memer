//import discord api
const { Client, Events, GatewayIntentBits } = require("discord.js");
//import file stuff to load dictionary
const fs = require("fs");
//discord permissions or somthing
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
//get the dictionary from words.txt and put in dictionary, same with companies
console.log("getting dictionary");
var dictionary = fs.readFileSync("./words.txt", "utf8").split("\n");
var companies = fs.readFileSync("./companies.txt", "utf8").split("\n");
console.log(dictionary);
//when new message
client.on("messageCreate", (message) => {
  // Check if the message author is not the bot itself
  if (message.author.bot) return;
  //log the message
  console.log("Message received:", message.content);
  //remove periods and stuff
  const cleanedmessage = message.content.replace(/[,.!?;:]/g, "");  // Replace specified punctuation
  //split into words
  var words = cleanedmessage.content.split(" ");
  //create a list of search terms for later
  var search = ["meme"];
  //cycle through words
  words.forEach(function (word, index) {
    //if the word is a name(not normal english) then add it to the search terms along with the words next to it
    if (dictionary.includes(word.toLowerCase())) {
    } else {
      search.push(words[index]);
      search.push(words[index - 1]);
      search.push(words[index + 1]);
    }
    //if the word is a company then add it back
    if (companies.includes(word.toLowerCase())) {
      search.push(words[index]);
    }
  });
  //remove any undefined value(if the first word is a name then it will add undefined)
  search = search.filter((value) => value !== undefined);
  //log the search its going to do
  console.log(search);
  //if there are any search terms other than mem
  if (search.length > 1) {
    //use google image api to get memes
    fetch(
      "https://www.googleapis.com/customsearch/v1?q=" +
        search +
        "&cx=f5fde0317a3754392&key=" +
        process.env.googleapi +
        "&searchType=image",
    )
      .then((response) => response.json()) // Parse JSON when response arrives
      .then((data) => {
        const results = data.items;
        //for each meam send the meme
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
