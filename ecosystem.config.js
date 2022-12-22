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

      cwd: '/var/www/html/admin.wonderbites.app/',

      post_update: ['yarn install', 'yarn build', 'cd ./build && yarn install --production'],

      env: { NODE_ENV: 'production', ENV_PATH: '/var/www/html/admin.wonderbites.app/.env', PORT: 8080 },

    },
  ],
}
