const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const config = require('./config.json')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', GuildMember => {
    console.log("BAN")
    const flags = GuildMember.user.flags.serialize();
    for (const [key, value] of Object.entries(flags)) {
        for (const badge of config.tags){
            if (value === badge){
                if(key){
                    console.log("BAN")
                }
            }
        }
        console.log(key)
        console.log(value)
    }
});

// client.on('guildCreate', async Guild => {
//     Guild.members.cache.forEach( GuildMember => {
//         const flags = GuildMember.user.flags.serialize();
//         for (const [key, value] of Object.entries(flags)) {
//             console.log(key)
//             console.log(value)
//         }
//     })
// });

client.login(config.token);