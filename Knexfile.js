const dbType = "mysql" || "sqlite3";
const dbHost = "127.0.0.1";
const dbName = "kuma";
const dbUser = "root";
const dbPass = "Azerty123";

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
                max: 1,
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
