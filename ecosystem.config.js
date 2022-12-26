module.exports = {
  apps: [
    {

      name: 'admin.wonderbites.app',

      script: './build/server.js',

      autorestart: true,

      max_restarts: 20,

      restart_delay: 10000,

      max_memory_restart: '200M',

      instances: 1,

      exec_mode: 'cluster',

      kill_timeout: 3000,

      watch: true,

      ignore_watch: ['node_modules'],

      env: {

        PORT: process.env.ENV_PORT ?? 8080,

        NODE_ENV: 'production',

        ENV_PATH: process.env.ENV_PATH ?? '/srv/admin.wonderbites.app/.env',

      },

    },
  ],
}
