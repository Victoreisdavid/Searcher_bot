const { readdirSync } = require("fs")
const { put } = require("axios")
const ID = Config.bot.id
const colors = require("colors")

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
  for(const file of files) {
    console.log(colors.green(`${file} - carregado`))
    const prop = require(`../../commands/${file}`)
    if(guildID) {
      if(prop.limitations) {
        console.log(colors.yellow(`Limitações em ${file} detectadas.`))
        if(prop.limitations.register) {
          if(prop.limitations.register.local) {
            console.log(colors.yellow(`Há uma limitação em ${file} que o impede de ser registrando localmente.`))
            continue;
          }
        }
      }
      commands.push(prop.command)
    } else {
      if(prop.limitations) {
        console.log(`Limitações em ${file} detectadas.`)
        if(prop.limitations.register) {
          if(prop.limitations.register.global) {
            console.log(colors.yellow(`Há uma limitação em ${file} que o impede de ser registrando globalmente.`))
            continue;
          }
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
    console.log(colors.green(`Todos os comandos foram registrados em ${guildID}.`))
  } else {
    put(`https://discord.com/api/v9/applications/${ID}/commands`, commands, {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`
      }
    })
    console.log(colors.green(`Todos os comandos foram registrados em todos os servidores.`))
  }
}
