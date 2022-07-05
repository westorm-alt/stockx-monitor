// const fs = require('fs')
const UserAgent = require('user-agents')

// My code use cloudscraper. It's been deprecrated for a long time but it never fails to initiate requests and it have a cloudflare bypass incorporated so you just need to setup the request itself. 
const cloudscraper = require('cloudscraper')
const chalk = require('chalk')
const Discord = require('discord.js');
const tls = require('tls');
require('console-stamp')(console, '[HH:MM:ss.l]');

var userAgent = new UserAgent(/Chrome/, {
    deviceCategory: 'desktop'
});
var usedUserAgent = userAgent.toString().replace(/\|"/g, "");

// Proxy Setup. Might do it sometime in the future. 
// var proxy = fs.readFileSync('proxy.txt') 
// var proxyArray = proxy.toString().toLowerCase().split("\r\n").filter(l => l.length !== 0);
// var randomProxy = 'http://' + lodash.sample(proxyArray)

// Initiate Client
const client = new Discord.Client();
client.on('ready', () => {
    console.log(chalk.green(`Logged in as ${client.user.tag}!`));
});
client.on('message', msg => {
	if(msg.content.startsWith('!stockx')) {
		var content = new Object()
		content['URL'] = msg.content.split(/\s+/)[1];
		content['SIZE'] = msg.content.split(/\s+/)[2];
		content['PRICE'] = msg.content.split(/\s+/)[3];
		// Example used down below here.
		// E.G.: !stockx https://stockx.com/it-it/nike-dunk-low-retro-white-black-2021 5 230
		msg.delete({ timeout: 300 });
		msg.channel.send(`Hi! We will monitor your product ${msg.author}. We will ping you when your ask will be equal or higher.`);
		var productId = content['URL'].split('stockx.com/')[1].split('/')[1];
		async function findHighestBid() {
			const defaultCiphers = tls.DEFAULT_CIPHERS.split(':');
			const shuffledCiphers = [
					defaultCiphers[3],
					defaultCiphers[2],
					defaultCiphers[1],
					...defaultCiphers.slice(3)
			].join(':');
			var params = {
				method: 'GET',
				url: `https://stockx.com/api/products/${productId}?includes=market&currency=EUR`, 
				headers: {
					'accept': '*/*',
					'Content-Type': 'application/json',
					'app-platform': 'Iron',
					'app-version': '2022.06.19.01',
					'x-requested-with': 'XMLHttpRequest',
					'user-agent': usedUserAgent
				},
				timeout: 2000,
				resolveWithFullResponse: true,
				ciphers: shuffledCiphers
			}
			return await cloudscraper(params).then(response => {
				const data = JSON.parse(response.body)
				// I got this part by looking from an unofficial release API. Thanks to https://github.com/matthew1232/stockx-api
				const variantArray = [];
				const variants = data.Product.children;
				
					for (let key in variants){
						variantArray.push({
							size: variants[key].shoeSize,
							uuid: key,
							market: variants[key].market
						});
					};
				
				var foundMarketPrice = variantArray.find(element => element.size == content['SIZE']) 
				var highestBidMarketPrice = foundMarketPrice.market.highestBid
					
				// Parsing the product you used to find the ask / bid.
				var product = new Object()
				product['NAME'] = data.Product.shoe
				product['IMG'] = data.Product.media.imageUrl
				product['PID'] = data.Product.styleId
				return checkHighestBid(highestBidMarketPrice, product)
			}).catch(error => {
				if (error.message == "Error: ESOCKETTIMEDOUT") {
					console.log(error)
					function delay(time) {
						return new Promise(function(resolve) { 
							setTimeout(resolve, time)
						});
						}
					delay(3000)
					return
				} else {
					console.log(error)
				}
			})
			async function checkHighestBid(highestBidMarketPrice, product) {
				// Webhook Setup. You don't need to put your webhook link as it will use your own bot from your server. (Line 129)
				if(highestBidMarketPrice >= content['PRICE']) {
					console.log('Your Ask got matched!')
					const embeds = new Discord.MessageEmbed()
					.setColor('#428f4b')
					.setTitle('We found your ask matched! Please confirm your selling here below.')
					.setThumbnail(product['IMG'])
					.addFields(
						{ name: 'Product Name', value: product['NAME'], inline: true},
						{ name: 'Product PID', value: product['PID'], inline: true},
						{ name: 'Product Size', value: `US ${content['SIZE']}`, inline: true},
						{ name: 'SELL IT NOW!', value: `[US ${content['SIZE']} | ${highestBidMarketPrice} EUR | CLICK HERE](https://stockx.com/it-it/sell/${productId}?size=${content['SIZE']})`, inline: true},
						{ name: 'LOGIN', value: '[Click Here](https://accounts.stockx.com/login?state=hKFo2SBYWktuRjJLWm9LTFdZZUpnSkw0ZHctVUdZQXIzS2MxRqFupWxvZ2luo3RpZNkgb1MxN0tRTUcxT3VhTlIzYUNpbENwcmtTcXR5WUZrRVKjY2lk2SBPVnhydDRWSnFUeDdMSVVLZDY2MVcwRHVWTXBjRkJ5RA&client=OVxrt4VJqTx7LIUKd661W0DuVMpcFByD&protocol=oauth2&prompt=login&audience=gateway.stockx.com&auth0Client=eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xOS4wIn0%3D&connection=production&lng=it&redirect_uri=https%3A%2F%2Fstockx.com%2Fcallback%3Fpath%3D%2Fit-it%2Fnike-dunk-low-retro-white-black-2021&response_mode=query&response_type=code&scope=openid%20profile&stockx-currency=EUR&stockx-default-tab=login&stockx-is-gdpr=true&stockx-language=it-it&stockx-session-id=1d8d5ded-86e7-4ce5-8160-05b7614ee885&stockx-url=https%3A%2F%2Fstockx.com&stockx-user-agent=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F101.0.4951.67%20Safari%2F537.36%20OPR%2F87.0.4390.45&ui_locales=it)', inline: true},
					)
					.setTimestamp()
					.setFooter('Made by Westorm | Check my Github! https://github.com/westorm-alt');
					await msg.channel.send(embeds)
					await msg.channel.send(`${msg.author}`)
				} else {
					console.log(chalk.yellow('No Newer Ask Found. Will retry in 1 hour.'))
					function delay(time) {
						return new Promise(function(resolve) { 
							setTimeout(resolve, time)
						});
						}
					await delay(3600000) // Delay in ms. Default is 1 hour. (360.000 ms)
					return findHighestBid()
				}
			}
		}
		findHighestBid()
	
	} // Will update something to stop the bot to search for the product...
	// For now you will manually stop the bot if needed. I'm open to any solutions.
})

// Your bot token here.
client.login("Your bot token here!");


