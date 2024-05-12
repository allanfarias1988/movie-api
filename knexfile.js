import { resolve } from "node:path";

const definedNameDatabase = "database";

const knexSettings = {
  client: "sqlite3",
  connection: {
    filename: resolve("src", "database", String(`${definedNameDatabase}.db`)),
  },

  migrations: {
    directory: resolve("src", "database", "knex", "migrations"),
    tableName: "knex_migrations",
  },

  useNullAsDefault: true,

  pool: {
    afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb),
  },
};

export default knexSettings;
