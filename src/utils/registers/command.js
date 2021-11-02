const { readdirSync } = require("fs")
const { post } = require("axios")
const ID = Config.bot.id
const colors = require("colors")

module.exports = function (guildID, file) {
  console.log(colors.green(`Registrando o comando ${file}`))
  const prop = require(`../../commands/${file}`)
  if(guildID) {
    if(prop.limitations) {
      console.log(colors.yellow(`Limitações em ${file} detectadas.`))
      if(prop.limitations.register) {
        if(prop.limitations.register.local) {
          console.log(colors.yellow(`Há uma limitação em ${file} que o impede de ser registrado localmente.`))
          return;
        }
      }
    }
    post(`https://discord.com/api/v9/applications/${ID}/guilds/${guildID}/commands`, prop.command, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  } else {
    if(prop.limitations) {
      console.log(colors.yellow(`Limitações em ${file} detectadas.`))
      if(prop.limitations.register) {
        if(prop.limitations.register.global) {
          console.log(colors.yellow(`Há uma limitação em ${file} que o impede de ser registrado globalmente.`))
          return;
        }
      }
    }
    post(`https://discord.com/api/v9/applications/${ID}/commands`, prop.command, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  }
}
