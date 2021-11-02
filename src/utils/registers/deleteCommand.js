const axios = require("axios")
const ID = Config.bot.id
const colors = require("colors")

module.exports = async function (guildID, commandName) {
  console.log(colors.yellow(`deletando comando: ${commandName}`))
  if(guildID) {
    let command = await axios.get(`https://discord.com/api/v9/applications/${ID}/guilds/${guildID}/commands`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
    command = command.data.find(command => command.name == commandName)
    if(!command) return console.log(colors.red(`Não foi possível achar o comando, tem certeza que um comando com o nome \"${commandName}\" foi registrado?`));
    axios.delete(`https://discord.com/api/v9/applications/${ID}/guilds/${guildID}/commands/${command.id}`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  } else {
    let command = await axios.get(`https://discord.com/api/v9/applications/${ID}/commands`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
    command = command.data.find(command => command.name == commandName)
    if(!command) return console.log(colors.red(`Não foi possível achar o comando, tem certeza que um comando com o nome \"${commandName}\" foi registrado?`))
    axios.delete(`https://discord.com/api/v9/applications/${ID}/commands/${command.id}`, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  }
}
