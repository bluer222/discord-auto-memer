//ai is reccomended because without it this is bad, only use one of them
const useopenAi = false; //put key in OPENAI_API_KEY
const useedenAi = true; //put key in EDEN_AI
//import discord api put key in DISCORD_TOKEN
const { Client, Events, GatewayIntentBits } = require("discord.js");
//import file stuff to load dictionary
var sdk;
var chatgpt;
var openai;
var aiStartPrompt;
var dictionary;
var companies;
const fs = require("fs");
if(useedenAi){
//import eden.ai api
 sdk = require('api')('@eden-ai/v2.0#1e32zlqwkiuup');
}
if(useopenAi){
//import openai api
 openai = require("openai");
 chatgpt = new openai();
}
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
//if there is no ai then load dictionaries
if (!useopenAi && !useedenAi) {
  console.log("getting dictionary");
   dictionary = fs.readFileSync("./words.txt", "utf8").split("\n");
   companies = fs.readFileSync("./companies.txt", "utf8").split("\n");
  console.log(dictionary);
}else{
//if there is ai load start prompt
 aiStartPrompt = "I want you to do a simple task for me. You will be a meme search term bot creating search terms for memes on the internet. Simply take any input provided, find the key noun and verb, figure out what the input feels about that keyword (ONLY good or bad). If it is too simple, neutral, and not memeable, such as 'my name is jerry', respond with 'non memable'. If it is memable, respond with ONLY the keyword followed by the feeling meme, for example 'windows is bad meme'. Do NOT include anything else like dashes, quotes, bullet points, etc, you can only have words and spaces.";
}
//function to convert messages to search terms using ai or algorithem
async function convertToSearchTerms(message) {
  if (useedenAi) {
      await sdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODYwMjc2OGMtY2M3Yy00NzViLTgwYTQtNDRmOWUyM2VjNTQyIiwidHlwZSI6ImFwaV90b2tlbiJ9.qf2bDwM0v_pBNUAcz4rNdPTH6mxnp48dszQfa5ZhW5g');
      let data = await sdk.text_chat_create({
        response_as_dict: true,
        attributes_as_list: false,
        show_original_response: false,
        temperature: 0,
        max_tokens: 500,
        providers: 'google',
        chatbot_global_action: aiStartPrompt,
        text: "remember, you are a search term bot, only respond with search terms seperated by spaces, if it is not memable then respond with \'non memable\', here is the message: '" + message.content + "'",
      }).then((data) => {
              searchGoogle(data.data.google.generated_text, message);
        });
  } else if (useopenAi) {
    //if ai then query the openai api with a prompt and get the responce
    chatgpt.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: aiStartPrompt,
          },
          {
            role: "user",
            content:
              "remember, you are a search term bot, only respond with search terms seperated by spaces, if it is not memable then respond with 'non memable', here is the message: 'why are you using windows 10, linux is so much better'",
          },
          { role: "assistant", content: "windows 10 bad meme" },
          {
            role: "user",
            content:
              "remember, you are a search term bot, only respond with search terms seperated by spaces, if it is not memable then respond with 'non memable', here is the message: '" +
              message.content +
              "'",
          },
        ],
        model: "gpt-3.5-turbo",
      })
      .then((response) => response.json())
      .then((data) => {
            searchGoogle( data.choices.message.content, message);
      });
  } else {
    //remove periods and stuff
    const cleanedmessage = message.content.replace(/[,.!?;:]/g, ""); // Replace specified punctuation
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
    if ((search.length = 1)) {
      let results = "non memable";
    } else {
      let results = search;
    }
      searchGoogle(results, message);
  }
}
function searchGoogle(search, message){
     //log the search its going to do
      console.log("doing search:");
        console.log(search);
      //make sure there is a search
      if (!search.includes("non memable")) {
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
              if (index < 3) {
                message.channel.send(result.link);
              }
            });
          });
      }
    
}
client.on("messageCreate", (message) => {
  // Check if the message author is not the bot itself
  if (message.author.bot) return;
  //log the message
  console.log("Message received:", message.content);
  //convert message to meme search terms
  let search = convertToSearchTerms(message);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
