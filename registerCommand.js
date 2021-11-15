/*
	caso coloque um ID de servidor, o ID precisa ser válido e que o bot esteja no servidor, e o commandName precisa ser o nome do arquivo onde está o código do comando.
*/
const { readFileSync, readdirSync } = require("fs")
const { parse } = require("yaml")
const yamlFile = readFileSync("./config.yaml", "utf8")
const colors = require("colors")

global.Config = parse(yamlFile)

let guildID = process.argv[2]
let commandName;
if(!isNaN(guildID)) {
    commandName = process.argv[3]
} else {
    commandName = process.argv[2]
    guildID = undefined
}

if(!commandName) return console.log(colors.red("Coloque o nome do arquivo onde está o comando"))

require("./src/utils/registers/command")(guildID, commandName)