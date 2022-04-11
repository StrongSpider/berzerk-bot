const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require('./config.json')
const axios = require('axios')

//Heroku Uptime stuff so bot doesnt DC
const express = require("express");
const { channel } = require('diagnostics_channel');
const app = express()
app.use(express.static("public"))

app.get("/", function (req, res) {
    res.redirect("https://github.com/StrongSpider/berzerk-bot")
})
app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));

function checkUserBadge(GuildMember) {
    let user = GuildMember.user

    //Flags = Badges
    //Checks if user has no badges
    if (user.flags !== null) {
        const flags = user.flags.serialize();
        for (const [key, value] of Object.entries(flags)) {
            for (const badge of config.tags) {
                //Checks if user badge is on the naughty list
                if (key === badge) {
                    if (value) {
                        //Bans user
                        GuildMember.ban({ reason: "User has blocked badge." })
                            .then(() => {
                                //Log Ban in console for debugging
                                console.log(user.username + " has been banned.")

                                //Informs the server owner of banning
                                GuildMember.guild.fetchOwner().then(owner => {
                                    owner.createDM().then(channel => channel.send(user.username + " has been banned for having a restricted badge."))
                                })

                                //Logging Embed parameters
                                var loggingParams = {
                                    embeds: [
                                        {
                                            "color": 16711680,
                                            "fields": [
                                                {
                                                    "name": "User Banned from Server",
                                                    "value": `${user.username} has been banned banned by this bot! 🎉🎉🎉\n#MakeDiscordGreatAgain`
                                                }
                                            ]
                                        }
                                    ]
                                }

                                //Log Bans in main Discord
                                axios.post(config.loggingWebhook, loggingParams).catch(console.log)
                            })
                            .catch(console.log)
                    }
                }
            }
        }
    }
}

function checkForPathos(Guild) {
    var channels = Guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT');
    for (var GUILD_TEXT of channels) {
        GUILD_TEXT[1].messages.fetch()
            .then(messages => messages.forEach(msg => {
                var member = Guild.members.cache.find(member => member.user.id === msg.author.id)
                if (msg.content.includes('pathos') && member) {
                    member.ban({ reason: "Said pathos" })
                        .then(() => msg.channel.send(`Banned user for using the phrase 'pathos': ${user.tag}`))
                        .catch(() => console.log('I was unable to ban the member!'));
                }
            }))
            .catch(console.error);
    }
}

client.on('ready', () => {
    //Sets presence
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.bannerURL('https://i.ibb.co/R4NsnM4/Bot-Banner.png')
    client.user.setPresence({ activities: [{ name: 'Making Discord Great Again' }] })

    //Checks all guilds for any badge updates when bot was offline
    client.guilds.cache.forEach(Guild => {
        Guild.members.cache.forEach(checkUserBadge);
        checkForPathos(Guild)
    });
});

client.on('guildMemberAdd', GuildMember => {
    //Checks badge when join server
    checkUserBadge(GuildMember);
});

//Pathos on message
client.on('messageCreate', Message => {
    if (Message.content.includes('pathos') && Message.member) {
        Message.member.ban({ reason: "Said pathos" })
            .then(() => Message.channel.send(`Banned user for using the phrase 'pathos': ${Message.member.user.tag}`))
            .catch(() => console.log('I was unable to ban the member!'));
    }
})


client.on('guildCreate', async Guild => {
    //Checks all members badge when bot joins server
    Guild.members.cache.forEach(checkUserBadge);
    checkForPathos(Guild)
});

client.login(config.token);