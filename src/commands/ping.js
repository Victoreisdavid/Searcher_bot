module.exports = {
 command: {
  name: "ping",
  description: "Ping?"
 },
 execute: async function(data) {
 return {
  type: Constants.callback_type.MESSAGE,
  data: {
   content: ":ping_pong: Pong!"
   }
  }
 }
}