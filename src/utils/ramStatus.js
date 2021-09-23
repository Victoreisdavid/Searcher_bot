const cronjob = require("node-cron")
let registeredUses = []

cronjob.schedule("*/1 * * * *", () => {
  if(registeredUses.length > 30) {
    registeredUses = []
  }
  registeredUses.push(process.memoryUsage().rss / 1024 / 1024)
})

module.exports = {
  getStatus: function() {
    return registeredUses
  }
}