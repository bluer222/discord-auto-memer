# discord auto memer
 automatically finds relevant memes and posts them \n
Goals\n
1. identify memable messages and create search term
    1. remove any words from word list leaving only names(keep the words around the name for context)
    2. identify any company names/products and add them back if removed
    3. if there are any words remaining then proceed
2. search for memes
    1. use google api to get images
    2. check for repeats(not implemented)
    3. ensure the meme actually contains the name(not implemented)
3. send top 3 memes