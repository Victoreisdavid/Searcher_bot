const { readdirSync } = require("fs")
const { post } = require("axios")
const ID = Config.bot.id

module.exports = function (guildID, file) {
  console.log(guildID, file)
  const prop = require(`../../commands/${file}`)
  if (guildID) {
    if (prop.limitations) {
      console.log(`Limitações em ${file} detectadas.`)
      if (prop.limitations.register) {
        if (prop.limitations.register.local) return;
      }
    }
    post(`https://discord.com/api/v9/applications/${ID}/guilds/${guildID}/commands`, prop.command, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  } else {
    if (prop.limitations) {
      console.log(`Limitações em ${file} detectadas.`)
      if (prop.limitations.register) {
        if (prop.limitations.register.global) return;
      }
    }
    post(`https://discord.com/api/v9/applications/${ID}/commands`, prop.command, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  }
}
