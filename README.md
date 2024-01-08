# discord auto memer
 automatically finds relevant memes and posts them     
Goals    
1. identify memable messages and create search term, this has two options, ai and no ai, in index.js you can choose openai, eden ai(https://www.edenai.co/) or set both to false and use the non ai
    1. ai, in this it uses an ai to convert messages into search temrms for memes
    2. the following is how it does without ai
        1. remove any words from word list leaving only names(keep the words around the name for context)
        2. identify any company names/products and add them back if removed
        3. if there are any words remaining then proceed
2. search for memes
    1. use google api to get images
    2. check for repeats(not implemented)
    3. ensure the meme actually contains the name(not implemented)
3. send top 3 memes

This bot requires a couple env api keys     
1. DISCORD_TOKEN, this is your discord bot token
2. GOOGLE_API, this is your google image search api key
3. OPENAI_API_KEY, this is only required if your using openai
3. EDEN_AI, this is only required if your using eden ai