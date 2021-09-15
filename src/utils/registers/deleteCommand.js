const axios = require("axios")
const ID = "886046032616624138"

module.exports = async function(guildID, commandName) {
 console.log("deletando comando:", commandName)
 if(guildID) {
  let command = await axios.get(`https://discord.com/api/v8/applications/${ID}/guilds/${guildID}/commands`, {
   headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`
   }
  })
  command = command.data.find(command => command.name == commandName)
  if(!command) return console.log("Comando não encontrado.")
  axios.delete(`https://discord.com/api/v8/applications/${ID}/guilds/${guildID}/commands/${command.id}`, {
   headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`
   }
  })
 } else {
  let command = await axios.get(`https://discord.com/api/v8/applications/${ID}/commands`, {
   headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`
   }
  })
  command = command.data.find(command => command.name == commandName)
  if(!command) return console.log("Comando não encontrado.")
  axios.delete(`https://discord.com/api/v8/applications/${ID}/commands/${command.id}`, {
   headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`
   }
  })
 }
}