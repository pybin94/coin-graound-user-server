// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: "user-server",
            script: "npm",
            args: "run start",
            time: true,
            // cron_restart: "0 5 * * *",
            output: "~/.pm2/logs/user-server/out.log",
            error: "~/.pm2/logs/user-server/error.log",
        },
    ],
};
  