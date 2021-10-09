const { readdirSync } = require("fs")
const { put } = require("axios")
const ID = Config.bot.id

function sleep() {
  setTimeout(() => {
    return new Promise((resolve, reject) => {
      resolve("ok")
    })
  }, 2000)
}

module.exports = async function (guildID) {
  const commands = []
  const files = readdirSync("./src/commands")
  for (const file of files) {
    console.log(`${file} - registrado`)
    const prop = require(`../../commands/${file}`)
    if (guildID) {
      if (prop.limitations) {
        console.log(`Limitações em ${file} detectadas.`)
        if (prop.limitations.register) {
          console.log(`Limitações de registro detectadas em ${file}`)
          if (prop.limitations.register.local) continue;
        }
      }
      commands.push(prop.command)
    } else {
      if (prop.limitations) {
        console.log(`Limitações em ${file} detectadas.`)
        if (prop.limitations.register) {
          console.log(`Limitações de registro detectadas em ${file}`)
          if (prop.limitations.register.global) continue;
        }
      }
      commands.push(prop.command)
    }
    await sleep()
  }
  if(guildID) {
    put(`https://discord.com/api/v9/applications/${ID}/guilds/${guildID}/commands`, commands, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  } else {
    put(`https://discord.com/api/v9/applications/${ID}/commands`, commands, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
  }
}
