/*
 * For Client Socket
 */
const { TimeLogger } = require("../src/util");
const { R } = require("redbean-node");
const { UptimeKumaServer } = require("./uptime-kuma-server");
const server = UptimeKumaServer.getInstance();
const io = server.io;
const { setting } = require("./util-server");
const checkVersion = require("./check-version");

/**
 * Send list of notification providers to client
 * @param {Socket} socket Socket.io socket instance
 * @returns {Promise<Bean[]>}
 */
async function sendNotificationList(socket) {
    const timeLogger = new TimeLogger();

    let result = [];
    let list = await R.find("notification", " user_id = ? ", [socket.userID]);

    for (let bean of list) {
        let notificationObject = bean.export();
        notificationObject.isDefault = notificationObject.isDefault === 1;
        notificationObject.active = notificationObject.active === 1;
        result.push(notificationObject);
    }

    io.to(socket.userID).emit("notificationList", result);

    timeLogger.print("Send Notification List");

    return list;
}

/**
 * Send Heartbeat History list to socket
 * @param {Socket} socket Socket.io instance
 * @param {number} monitorID ID of monitor to send heartbeat history
 * @param {boolean} [toUser=false]  True = send to all browsers with the same user id, False = send to the current browser only
 * @param {boolean} [overwrite=false] Overwrite client-side's heartbeat list
 * @returns {Promise<void>}
 */
async function sendHeartbeatList(
    socket,
    monitorID,
    toUser = false,
    overwrite = false
) {
    const timeLogger = new TimeLogger();

    let list = await R.getAll(
        `
        SELECT * FROM heartbeat
        WHERE monitor_id = ?
        ORDER BY time DESC
        LIMIT 100
    `,
        [monitorID]
    );

    let result = list.reverse();

    if (toUser) {
        io.to(socket.user_organization).emit(
            "heartbeatList",
            monitorID,
            result,
            overwrite
        );
    } else {
        socket.emit("heartbeatList", monitorID, result, overwrite);
    }

    timeLogger.print(`[Monitor: ${monitorID}] sendHeartbeatList`);
}

async function sendAddonHeartbeatList(socket) {
    let list = {
        1: {
            1: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            2: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            3: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            4: {
                msg: "error",
                time: "2023-06-11T19:48:10.000Z",
            },
            5: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            6: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            7: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            8: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            9: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            10: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
            11: {
                msg: "started",
                time: "2023-06-11T19:48:10.000Z",
            },
        },
    };
    socket.emit("addonHeartbeatList", list);
}

/**
 * Important Heart beat list (aka event list)
 * @param {Socket} socket Socket.io instance
 * @param {number} monitorID ID of monitor to send heartbeat history
 * @param {boolean} [toUser=false]  True = send to all browsers with the same user id, False = send to the current browser only
 * @param {boolean} [overwrite=false] Overwrite client-side's heartbeat list
 * @returns {Promise<void>}
 */
async function sendImportantHeartbeatList(
    socket,
    monitorID,
    toUser = false,
    overwrite = false
) {
    const timeLogger = new TimeLogger();

    let list = await R.find(
        "heartbeat",
        `
        monitor_id = ?
        AND important = 1
        ORDER BY time DESC
        LIMIT 500
    `,
        [monitorID]
    );

    timeLogger.print(`[Monitor: ${monitorID}] sendImportantHeartbeatList`);

    if (toUser) {
        io.to(socket.UserGroup).emit(
            "importantHeartbeatList",
            monitorID,
            list,
            overwrite
        );
    } else {
        socket.emit("importantHeartbeatList", monitorID, list, overwrite);
    }
}

/**
 * Emit proxy list to client
 * @param {Socket} socket Socket.io socket instance
 * @return {Promise<Bean[]>}
 */
async function sendProxyList(socket) {
    const timeLogger = new TimeLogger();

    const list = await R.find("proxy", " user_id = ? ", [socket.userID]);
    io.to(socket.userID).emit(
        "proxyList",
        list.map((bean) => bean.export())
    );

    timeLogger.print("Send Proxy List");

    return list;
}

/**
 * Emit API key list to client
 * @param {Socket} socket Socket.io socket instance
 * @returns {Promise<void>}
 */
async function sendAPIKeyList(socket) {
    const timeLogger = new TimeLogger();

    let result = [];
    const list = await R.find("api_key", "user_id=?", [socket.userID]);

    for (let bean of list) {
        result.push(bean.toPublicJSON());
    }

    io.to(socket.userID).emit("apiKeyList", result);
    timeLogger.print("Sent API Key List");

    return list;
}

/**
 * Emits the version information to the client.
 * @param {Socket} socket Socket.io socket instance
 * @returns {Promise<void>}
 */
async function sendInfo(socket) {
    socket.emit("info", {
        version: checkVersion.version,
        latestVersion: checkVersion.latestVersion,
        primaryBaseURL: await setting("primaryBaseURL"),
        serverTimezone: await server.getTimezone(),
        serverTimezoneOffset: server.getTimezoneOffset(),
    });
}

/**
 * Send list of docker hosts to client
 * @param {Socket} socket Socket.io socket instance
 * @returns {Promise<Bean[]>}
 */
async function sendDockerHostList(socket) {
    const timeLogger = new TimeLogger();

    let result = [];
    let list = await R.find("docker_host", " user_id = ? ", [socket.userID]);

    for (let bean of list) {
        result.push(bean.toJSON());
    }

    io.to(socket.userID).emit("dockerHostList", result);

    timeLogger.print("Send Docker Host List");

    return list;
}

module.exports = {
    sendNotificationList,
    sendImportantHeartbeatList,
    sendHeartbeatList,
    sendProxyList,
    sendAPIKeyList,
    sendInfo,
    sendDockerHostList,
    sendAddonHeartbeatList,
};
