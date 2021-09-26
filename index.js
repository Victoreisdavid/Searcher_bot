/*
	Pra uma melhor organização, tudo o que for relacionado ao bot ficará dentro da pasta "src".
*/

const { readFileSync, readdirSync } = require("fs")
const { parse } = require("yaml")
const yamlFile = readFileSync("./config.yaml", "utf8")

global.Config = parse(yamlFile)
global.Constants = require("./src/utils/constants/flags")
global.Bluebird = require("bluebird")
global.commands = new Map()

const files = readdirSync("./src/commands")
for (const file of files) {
  const prop = require(`./src/commands/${file}`)
  commands.set(prop.command.name, prop)
}
console.log("Comandos carregados:", files.length)

require("dotenv").config()
require("./src/client")
require("./src/index");
require("./src/utils/ramStatus")