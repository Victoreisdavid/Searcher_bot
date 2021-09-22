/*
	caso coloque um ID de servidor, o ID precisa ser válido e que o bot esteja no servidor, e o commandName precisa ser o nome do arquivo onde está o código do comando.
*/
let guildID = process.argv[2]
let commandName;
if (!isNaN(guildID)) {
  commandName = process.argv[3]
} else {
  commandName = process.argv[2]
  guildID = undefined
}

if (!commandName) return console.log("Coloque o nome do arquivo onde está o comando")

console.log(guildID, commandName)

require("./src/utils/registers/command")(guildID, commandName)