require("dotenv").config({ path: "./secret.env" });

const dbType = "mysql" || "sqlite3";
const dbHost = process.env.DATABASEHOST;
const dbName = process.env.DATABASENAME;
const dbUser = process.env.DATABASEUSER;
const dbPass = process.env.DATABASEPASSWORD;

let database;

switch (dbType) {
    case "sqlite3":
        const dialect = require("knex/lib/dialects/sqlite3/index.js");
        dialect.prototype._driver = () => require("@louislam/sqlite3");

        database = {
            client: dialect,
            connection: {
                filename: "./data/kuma.db",
                acquireConnectionTimeout: 120 * 1000,
            },
            useNullAsDefault: true,
            pool: {
                min: 1,
                max: 10,
                idleTimeoutMillis: 120 * 1000,
                propagateCreateError: false,
                acquireTimeoutMillis: 120 * 1000,
            },
            migrations: {
                tableName: "knex_migrations",
            },
        };
        break;

    case "mysql":
        database = {
            client: "mysql",
            connection: {
                host: dbHost,
                user: dbUser,
                database: dbName,
                password: dbPass,
            },
        };
        break;
}

function setPath(path) {
    if (dbType !== "sqlite") {
        return;
    }

    database.connection.filename = path;
}

function getDialect() {
    return dbType;
}

module.exports = {
    development: database,
    production: database,
    setPath: setPath,
    getDialect: getDialect,
};
