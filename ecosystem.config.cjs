module.exports = {
  apps: [
    {
      name: 'redwebs',
      script: 'dist/server.cjs',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
