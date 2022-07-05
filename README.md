# Stockx Monitor 
A Stockx Monitor that helps you find the better deal automatically from your desired price ask. Simple and Open-Sourced code made in NodeJS with discord integration. 
## Getting Started and Usage
The following guide will help you to install a copy of the project with ease.
### Prerequisites
By using my code, I'm expecting you to already have [NodeJS](https://nodejs.org/en/) installed and an editor like [Visual Studio Code](https://code.visualstudio.com). You can use the terminal to initiate the script by simply running `node index.js` after installing the necessary. Let me know if you want me to convert it in an executable and make it a CLI.
- You will need a bot for your discord server. You can find a guide [here](https://discord.com/developers/docs/intro).
- Clone or download the repository first, open your editor and input the following command.
```
npm install
```
You will only need the following input:
- Your bot token

As listed above, you will find a guide where to find your bot token. If you still don't know where or how to make one, use this simple guide [here](https://www.writebots.com/discord-bot-token/)

### Usage
To start the script just simply use the following command in the terminal.
```
node index.js
```
Then, in your preferred channel, input the following command.
```
!stockx https://stockx.com/it-it/nike-dunk-low-retro-white-black-2021 5 230
```
In order, input the product link, the size (in US) and the desired price in ask.

### Features 
You can setup:
- Delay in ms

The program will automatically fetch the following data:
- Your product's name, sku and size
- Your ask with a quick link to sell it
- A login quick link
- Automatic ping when ask is found

### Example Webhook
![EXAMPLE](https://user-images.githubusercontent.com/78883935/177301253-d40f7a11-a5fc-4f24-92d6-e915bfd18475.PNG)

[DISCLAIMER] When selling, be mindful that the price you are asking will be affected to stockx's fees and shipping, so it will vary at the end.

### Future features
If you want to fork this repository, feel free to. I will make some updates in the future. What I have in mind:
- Proxies setup
- Automatic stop to search from discord command
- Discord webhook integration (optional)
- Easier configuration

I'm quite lazy as I could have done it earlier but oh well.

### Author
- Westorm - [Twitter](https://twitter.com/bottingoursite) | Dean Martin - [Twitter](https://twitter.com/deanmartinang)

If you want to support me, you can donate here.

- [Buy Me a Coffee](https://www.buymeacoffee.com/westorm)
### Issues and Feedback
- Please let me know if you want anything to change! Open a request for any issues or feedback.

Also thanks to @matthew1231. I got inspiration by him and his project. You can see his unofficial API [here](https://github.com/matthew1232/stockx-api)
