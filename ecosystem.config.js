module.exports = {
  apps: [
    {
      name: "admin.wonderbites",
      script: "./build/server.js",
      watch: true,
      autorestart: true,
      max_restarts: 20,
      restart_delay: 10000,
      max_memory_restart: '200M',
      instances: 1,
      exec_mode: "cluster",
      kill_timeout: 3000,
      cwd: "/home/ubuntu/sites/wonderbites.com/",
      post_update: ['yarn install', 'yarn build', 'cd ./build && yarn install --production'],
      env: { NODE_ENV: "production", ENV_PATH: "/home/ubuntu/sites/wonderbites.com/.env", PORT: 8080 },
    }
  ]
}
