module.exports = {
  apps: [{
    name: "wonderbites",
    script: "./build/server.js",
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
  }]
}
