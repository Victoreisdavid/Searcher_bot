/*
	O parâmetro 1 deve ser o ID do servidor, enquanto o 2 deve ser o nome do comando que você quer remover.
*/
const { readFileSync, readdirSync } = require("fs")
const { parse } = require("yaml")
const yamlFile = readFileSync("./config.yaml", "utf8")

global.Config = parse(yamlFile)

let guildID = process.argv[2]
let commandName;
if (!isNaN(guildID)) {
  commandName = process.argv.splice(3).join(" ")
} else {
  commandName = process.argv.splice(2).join(" ")
  guildID = undefined
}

require("./src/utils/registers/deleteCommand")(guildID, commandName)