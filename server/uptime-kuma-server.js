const express = require("express");
const https = require("https");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const { R } = require("redbean-node");
const { log } = require("../src/util");
const Database = require("./database");
const util = require("util");
const { CacheableDnsHttpAgent } = require("./cacheable-dns-http-agent");
const { Settings } = require("./settings");
const dayjs = require("dayjs");
const { PluginsManager } = require("./plugins-manager");

// DO NOT IMPORT HERE IF THE MODULES USED `UptimeKumaServer.getInstance()`

/**
 * `module.exports` (alias: `server`) should be inside this class, in order to avoid circular dependency issue.
 * @type {UptimeKumaServer}
 */
class UptimeKumaServer {
    /**
     *
     * @type {UptimeKumaServer}
     */
    static instance = null;

    /**
     * Main monitor list
     * @type {{}}
     */
    monitorList = {};

    /**
     * Main maintenance list
     * @type {{}}
     */
    maintenanceList = {};

    entryPage = "dashboard";
    app = undefined;
    httpServer = undefined;
    io = undefined;

    /**
     * Cache Index HTML
     * @type {string}
     */
    indexHTML = "";

    /**
     * Plugins Manager
     * @type {PluginsManager}
     */
    pluginsManager = null;

    /**
     *
     * @type {{}}
     */
    static monitorTypeList = {};

    static getInstance(args) {
        if (UptimeKumaServer.instance == null) {
            UptimeKumaServer.instance = new UptimeKumaServer(args);
        }
        return UptimeKumaServer.instance;
    }

    constructor(args) {
        // SSL
        const sslKey =
            args["ssl-key"] ||
            process.env.UPTIME_KUMA_SSL_KEY ||
            process.env.SSL_KEY ||
            undefined;
        const sslCert =
            args["ssl-cert"] ||
            process.env.UPTIME_KUMA_SSL_CERT ||
            process.env.SSL_CERT ||
            undefined;
        const sslKeyPassphrase =
            args["ssl-key-passphrase"] ||
            process.env.UPTIME_KUMA_SSL_KEY_PASSPHRASE ||
            process.env.SSL_KEY_PASSPHRASE ||
            undefined;

        log.info("server", "Creating express and socket.io instance");
        this.app = express();
        if (sslKey && sslCert) {
            log.info("server", "Server Type: HTTPS");
            this.httpServer = https.createServer(
                {
                    key: fs.readFileSync(sslKey),
                    cert: fs.readFileSync(sslCert),
                    passphrase: sslKeyPassphrase,
                },
                this.app
            );
        } else {
            log.info("server", "Server Type: HTTP");
            this.httpServer = http.createServer(this.app);
        }

        try {
            this.indexHTML = fs.readFileSync("./dist/index.html").toString();
        } catch (e) {
            // "dist/index.html" is not necessary for development
            if (process.env.NODE_ENV !== "development") {
                log.error(
                    "server",
                    "Error: Cannot find 'dist/index.html', did you install correctly?"
                );
                process.exit(1);
            }
        }

        this.io = new Server(this.httpServer);
    }

    /** Initialise app after the database has been set up */
    async initAfterDatabaseReady() {
        await CacheableDnsHttpAgent.update();

        process.env.TZ = await this.getTimezone();
        dayjs.tz.setDefault(process.env.TZ);
        log.debug("DEBUG", "Timezone: " + process.env.TZ);
        log.debug("DEBUG", "Current Time: " + dayjs.tz().format());

        await this.loadMaintenanceList();
    }

    /**
     * Send list of monitors to client
     * @param {Socket} socket
     * @returns {Object} List of monitors
     */
    async sendMonitorList(socket) {
        let list = await this.getMonitorJSONList(socket.user_organization);
        let addon = await this.getAddOnsList();
        this.io.to(socket.user_organization).emit("monitorList", list);
        this.io.to(socket.user_organization).emit("addOnsList", addon);
        return list;
    }

    async sendAddonList(socket) {
        let addon = await this.getAddOnsList();
        return addon;
    }

    async sendUserList(socket) {
        let userList = await this.getUserList(socket.user_organization);
        this.io.to(socket.user_organization).emit("userList", userList);
        return userList;
    }

    async getUserList(userorganization) {
        try {
            let users = await R.find("user", "user_organization = ?", [
                userorganization,
            ]);

            let userList = [];
            users.forEach((userObj) => {
                let user = {
                    id: userObj.id,
                    username: userObj.username,
                    userOrganization: userObj.user_organization,
                    role: userObj.role,
                };
                userList.push(user);
            });

            return userList;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Get a list of monitors for the given user.
     * @param {string} userID - The ID of the user to get monitors for.
     * @returns {Promise<Object>} A promise that resolves to an object with monitor IDs as keys and monitor objects as values.
     *
     * Generated by Trelent
     */
    async getMonitorJSONList(userID) {
        let result = {};
        let monitorList = await R.find(
            "monitor",
            "user_organization = ? ORDER BY weight DESC, name",
            [userID]
        );

        for (let monitor of monitorList) {
            result[monitor.id] = await monitor.toJSON();
        }

        return result;
    }

    async getAddOnsList() {
        let addonList = await R.findAll("add_ons");
        let organizedData = {};

        addonList.forEach((row) => {
            const monitorId = row.monitor_id.toString();
            const addonId = row._id.toString();
            if (!organizedData[monitorId]) {
                organizedData[monitorId] = {};
            }

            organizedData[monitorId][addonId] = row;
        });

        return organizedData;
    }

    /**
     * Send maintenance list to client
     * @param {Socket} socket Socket.io instance to send to
     * @returns {Object}
     */
    async sendMaintenanceList(socket) {
        return await this.sendMaintenanceListByUserID(socket.user_organization);
    }

    /**
     * Send list of maintenances to user
     * @param {number} userID
     * @returns {Object}
     */
    async sendMaintenanceListByUserID(userID) {
        let list = await this.getMaintenanceJSONList(userID);
        this.io.to(userID).emit("maintenanceList", list);
        return list;
    }

    /**
     * Get a list of maintenances for the given user.
     * @param {string} userID - The ID of the user to get maintenances for.
     * @returns {Promise<Object>} A promise that resolves to an object with maintenance IDs as keys and maintenances objects as values.
     */
    async getMaintenanceJSONList(userID) {
        let result = {};
        for (let maintenanceID in this.maintenanceList) {
            result[maintenanceID] = await this.maintenanceList[
                maintenanceID
            ].toJSON();
        }
        return result;
    }

    /**
     * Load maintenance list and run
     * @param userID
     * @returns {Promise<void>}
     */
    async loadMaintenanceList(userID) {
        let maintenanceList = await R.findAll(
            "maintenance",
            " ORDER BY end_date DESC, title",
            []
        );

        for (let maintenance of maintenanceList) {
            this.maintenanceList[maintenance.id] = maintenance;
            maintenance.run(this);
        }
    }

    getMaintenance(maintenanceID) {
        if (this.maintenanceList[maintenanceID]) {
            return this.maintenanceList[maintenanceID];
        }
        return null;
    }

    /**
     * Write error to log file
     * @param {any} error The error to write
     * @param {boolean} outputToConsole Should the error also be output to console?
     */
    static errorLog(error, outputToConsole = true) {
        const errorLogStream = fs.createWriteStream(
            Database.dataDir + "/error.log",
            {
                flags: "a",
            }
        );

        errorLogStream.on("error", () => {
            log.info("", "Cannot write to error.log");
        });

        if (errorLogStream) {
            const dateTime = R.isoDateTime();
            errorLogStream.write(`[${dateTime}] ` + util.format(error) + "\n");

            if (outputToConsole) {
                console.error(error);
            }
        }

        errorLogStream.end();
    }

    /**
     * Get the IP of the client connected to the socket
     * @param {Socket} socket
     * @returns {string}
     */
    async getClientIP(socket) {
        let clientIP = socket.client.conn.remoteAddress;

        if (clientIP === undefined) {
            clientIP = "";
        }

        if (await Settings.get("trustProxy")) {
            const forwardedFor =
                socket.client.conn.request.headers["x-forwarded-for"];

            return (
                (typeof forwardedFor === "string"
                    ? forwardedFor.split(",")[0].trim()
                    : null) ||
                socket.client.conn.request.headers["x-real-ip"] ||
                clientIP.replace(/^.*:/, "")
            );
        } else {
            return clientIP.replace(/^.*:/, "");
        }
    }

    /**
     * Attempt to get the current server timezone
     * If this fails, fall back to environment variables and then make a
     * guess.
     * @returns {Promise<string>}
     */
    async getTimezone() {
        let timezone = await Settings.get("serverTimezone");
        if (timezone) {
            return timezone;
        } else if (process.env.TZ) {
            return process.env.TZ;
        } else {
            return dayjs.tz.guess();
        }
    }

    /**
     * Get the current offset
     * @returns {string}
     */
    getTimezoneOffset() {
        return dayjs().format("Z");
    }

    /**
     * Set the current server timezone and environment variables
     * @param {string} timezone
     */
    async setTimezone(timezone) {
        await Settings.set("serverTimezone", timezone, "general");
        process.env.TZ = timezone;
        dayjs.tz.setDefault(timezone);
    }

    /** Stop the server */
    async stop() {}

    loadPlugins() {
        this.pluginsManager = new PluginsManager(this);
    }

    /**
     *
     * @returns {PluginsManager}
     */
    getPluginManager() {
        return this.pluginsManager;
    }

    /**
     *
     * @param {MonitorType} monitorType
     */
    addMonitorType(monitorType) {
        if (monitorType instanceof MonitorType && monitorType.name) {
            if (monitorType.name in UptimeKumaServer.monitorTypeList) {
                log.error("", "Conflict Monitor Type name");
            }
            UptimeKumaServer.monitorTypeList[monitorType.name] = monitorType;
        } else {
            log.error("", "Invalid Monitor Type: " + monitorType.name);
        }
    }

    /**
     *
     * @param {MonitorType} monitorType
     */
    removeMonitorType(monitorType) {
        if (
            UptimeKumaServer.monitorTypeList[monitorType.name] === monitorType
        ) {
            delete UptimeKumaServer.monitorTypeList[monitorType.name];
        } else {
            log.error("", "Remove MonitorType failed: " + monitorType.name);
        }
    }
}

module.exports = {
    UptimeKumaServer,
};

// Must be at the end
const { MonitorType } = require("./monitor-types/monitor-type");
