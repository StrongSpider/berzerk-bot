const { Client, Intents, User } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS] });
const config = require('./config.json')
const axios = require('axios')

//Heroku Uptime stuff so bot doesnt DC
const express = require("express")
const app = express()
app.use(express.static("public"))

app.get("/", function (req, res) {
    res.redirect("https://github.com/StrongSpider/berzerk-bot")
})
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));

function sendWebhook(targetName){
    var params = {
        embeds: [
            {
                "color": 16711680,
                "fields": [
                    {
                        "name": "User Banned from Server",
                        "value": `${targetName} has been banned banned by this bot! 🎉🎉🎉\n#MakeDiscordGreatAgain`
                    }
                ]
            }
        ]
    }

    axios.post('https://canary.discord.com/api/webhooks/926222398099951626/Dw2yTHZ_iWDVR8rGw9BsUcM6qzw4N3iGjFuXie-zM6Sv7QBDEeh4unzK9_ZDwb0rcctg', params).catch(console.log)
}

function checkUserBadge(user){
    if(user.flags !== null) {
    const flags = user.flags.serialize();
      for (const [key, value] of Object.entries(flags)) {
         for (const badge of config.tags){
             if (key === badge){
                 if(value){
                        return true;
                    }
             }
          }
      }
    }
    return false;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.bannerURL('https://i.ibb.co/R4NsnM4/Bot-Banner.png')
    client.user.setPresence({ activities: [{ name: 'Making Discord Great Again' }]})
    client.guilds.cache.forEach( Guild => {
        Guild.members.cache.forEach( GuildMember => {
            if (checkUserBadge(GuildMember.user)){
                GuildMember.ban({reason: "User has blocked badge."})
                .then( () => {
                    console.log(GuildMember.user.username + " has been banned.")
                    GuildMember.guild.fetchOwner().then(owner => {
                        owner.createDM().then( channel => channel.send(GuildMember.user.username + " has been banned for having a restricted badge."))
                    })
                    sendWebhook(GuildMember.user.username)
                })
                .catch(console.log)
            }
         });
    });
});

client.on('guildMemberAdd', GuildMember => {
    if (checkUserBadge(GuildMember.user)){
        GuildMember.ban({reason: "User has blocked badge."})
        .then( () => {
            console.log(GuildMember.user.username + " has been banned.")
            GuildMember.guild.fetchOwner().then(owner => {
                owner.createDM().then( channel => channel.send(GuildMember.user.username + " has been banned for having a restricted badge."))
            })
            sendWebhook(GuildMember.user.username)
        })
        .catch(console.log)
    }
});

client.on('guildCreate', async Guild => {
     Guild.members.cache.forEach( GuildMember => {
        if (checkUserBadge(GuildMember.user)){
            GuildMember.ban({reason: "User has blocked badge."})
            .then( () => {
                console.log(GuildMember.user.username + " has been banned.")
                GuildMember.guild.fetchOwner().then(owner => {
                    owner.createDM().then( channel => channel.send(GuildMember.user.username + " has been banned for having a restricted badge."))
                })
                sendWebhook(GuildMember.user.username)
            })
            .catch(console.log)
        }
     })
 });

client.login(config.token);