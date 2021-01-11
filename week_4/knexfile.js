// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'week4',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

};

