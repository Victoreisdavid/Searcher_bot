/*
	Se for colocar um ID, coloque um válido e que o bot esteja no servidor.
*/
const { readFileSync, readdirSync } = require("fs")
const { parse } = require("yaml")
const yamlFile = readFileSync("./config.yaml", "utf8")

global.Config = parse(yamlFile)

const guild_id = process.argv[2]

require("./src/utils/registers/commands")(guild_id)