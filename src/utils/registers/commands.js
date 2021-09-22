const { readdirSync } = require("fs")
const { post } = require("axios")
const ID = "886046032616624138"

function sleep() {
  setTimeout(() => {
    return new Promise((resolve, reject) => {
      resolve("ok")
    })
  }, 2000)
}

module.exports = async function (guildID) {
  const files = readdirSync("./src/commands")
  for (const file of files) {
    console.log(`${file} - registrado`)
    const prop = require(`../../commands/${file}`)
    if (guildID) {
      if (prop.limitations) {
        console.log(`Limitações em ${file} detectadas.`)
        if (prop.limitations.register) {
          console.log(`Limitações de registro detectadas em ${file}`)
          if (prop.limitations.register.local) return;
        }
      }
      post(`https://discord.com/api/v8/applications/${ID}/guilds/${guildID}/commands`, prop.command, {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      })
    } else {
      if (prop.limitations) {
        console.log(`Limitações em ${file} detectadas.`)
        if (prop.limitations.register) {
          console.log(`Limitações de registro detectadas em ${file}`)
          if (prop.limitations.register.global) return;
        }
      }
      post(`https://discord.com/api/v9/applications/${ID}/commands`, prop.command, {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`
        }
      })
    }
    await sleep()
  }
}