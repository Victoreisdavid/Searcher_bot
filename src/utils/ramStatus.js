const cronjob = require("node-cron")
const registeredUses = []

cronjob.schedule("*/1 * * * *", () => {
  registeredUses.push(process.memoryUsage().rss / 1024 / 1024)
})

module.exports = {
  getStatus: function() {
    return registeredUses
  }
}