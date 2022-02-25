module.exports = {
  apps: [
    {

      name: "admin.wonderbites",

      script: "./build/server.js",

      autorestart: true,

      max_restarts: 20,

      restart_delay: 10000,

      max_memory_restart: '200M',

      instances: 1,

      exec_mode: "cluster",

      kill_timeout: 3000,

      watch: true,

      ignore_watch: ["node_modules"],

      cwd: "/home/ubuntu/sites/wonderbites.com/",

      post_update: ['yarn install', 'yarn build'],

      env: { NODE_ENV: "production", ENV_PATH: "/home/ubuntu/sites/wonderbites.com/.env", PORT: 8080 },

    }
  ]
}