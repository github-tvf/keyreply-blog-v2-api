const path = require('path');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_POST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '**', '*.entity.js')],
  migrations: [__dirname + '/dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
