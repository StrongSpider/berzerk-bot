const { Client, Intents, User } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS] });
const config = require('./config.json')

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
    client.guilds.cache.forEach( Guild => {
        Guild.members.cache.forEach( GuildMember => {
            if (checkUserBadge(GuildMember.user)){
                GuildMember.ban({reason: "User has blocked badge."})
                .then( () => {
                    console.log(GuildMember.user.username + " has been banned.")
                    GuildMember.guild.fetchOwner().then(owner => {
                        owner.createDM().then( channel => channel.send(GuildMember.user.username + " has been banned for having a restricted badge."))
                    })
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
            })
            .catch(console.log)
        }
     })
 });

client.login(config.token);