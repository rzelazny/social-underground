module.exports = {
  "development": {
    "username": process.env.USERNAME_DB,
    "password": process.env.PASS_DB,
    "database": process.env.DATABASE,
    "host": process.env.HOST_DB,
    "dialect": "mysql",
    "define": {
      "freezeTableName": true
      }
  },
  "test": {
    "username": "root",
    "password": "password",
    "database": "gaming_underground_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql",
    "define": {
      "freezeTableName": true
      }
  }
}
