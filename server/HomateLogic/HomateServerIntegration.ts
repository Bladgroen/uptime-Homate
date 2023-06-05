const axios = require("axios");
const cryptoModule = require("crypto");
const { R } = require("redbean-node");
require("dotenv").config({ path: "./secret.env" });

async function createConfig() {
    const config = {
        headers: {
            Authorization: "Bearer " + (await getToken()),
            "Content-Type": "application/json",
        },
    };
    return config;
}

async function getAddOns(monitorURL) {
    try {
        const apiURL = monitorURL + "/api/hassio/addons";

        const response = await axios.get(apiURL, await createConfig());

        const filteredAddons = response.data.data.addons.map((addon) => {
            return {
                name: addon.name,
                slug: addon.slug,
                update_available: addon.update_available,
                state: addon.state,
                url: apiURL + "/" + addon.slug,
                icon: apiURL + "/" + addon.slug + "/icon",
            };
        });
        return filteredAddons;
    } catch (error) {
        console.error(error);
    }
}

async function createAddons(monitorID, monitorURL) {
    try {
        const addOn = await getAddOns(monitorURL);
        addOn.forEach(async (addOn) => {
            const addon = {
                name: addOn.name,
                slug: addOn.slug,
                url: addOn.url,
                update_available: addOn.update_available,
                icon: addOn.icon,
                monitor_id: monitorID,
            };
            let addonDB = R.dispense("add_ons");
            addonDB.import(addon);
            await R.store(addonDB);
        });
    } catch (e) {
        console.log(e);
    }
}

async function deleteAddOns(monitorID) {
    try {
        await R.exec("DELETE FROM add_ons WHERE monitor_id = ? ", [monitorID]);
    } catch (error) {
        console.error(error);
    }
}

async function updateAddOns(slug, monitorURL, addonID) {
    const options = {
        method: "POST",
        url: monitorURL.url + "/api/hassio/store/addons/" + slug + "/update",
        headers: {
            Authorization: "Bearer " + (await getToken()),
            "Content-Type": "application/json",
        },
    };
    try {
        await axios.request(options);
        let addonDB = await R.find("add_ons", "monitor_id = ? AND slug = ?", [
            addonID,
            slug,
        ]);
        addonDB.update_available = 0;
        await R.store(addonDB);
    } catch (error) {
        console.error(error);
    }
}

async function getUsage(monitorID) {
    try {
        let bean = await R.findOne("monitor", "id = ?", [monitorID]);

        let response = await axios.get(
            bean._url + "/api/hassio/core/stats",
            await createConfig()
        );

        let usage = {
            cpu_percent: response.data.data.cpu_percent,
            memory_percent: response.data.data.memory_percent,
        };
        return usage;
    } catch (error) {
        console.error(error);
    }
}

async function createAddOnHeartbeat() {
    try {
        let bean = await R.find("monitor", "active = ?", [1]);
        bean.forEach(async (monitor) => {
            let response = await axios.get(
                monitor._url + "/api/hassio/addons",
                await createConfig()
            );
            let addons = response.data.data.addons;
            addons.forEach(async (addon) => {
                let addonDB = await R.findOne(
                    "add_ons",
                    "monitor_id = ? AND slug = ?",
                    [monitor.id, addon.slug]
                );

                if (addonDB) {
                    addonDB.active = addon.state === "started";

                    addonDB.update_available = addon.update_available;
                    await R.store(addonDB);
                    const status = {
                        monitor_id: monitor._id,
                        add_on_id: addonDB.id,
                        status: addon.state === "started" ? 1 : 0,
                        msg: addon.state,
                        time: new Date(),
                    };
                    let statusDB = R.dispense("add_on_heartbeat");
                    statusDB.import(status);
                    await R.store(statusDB);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}
async function getAddOnHeartbeat() {
    try {
        let addonHeartbeatList = await R.findAll("add_on_heartbeat");
        let organizedData = {};

        addonHeartbeatList.forEach((row) => {
            const key = row.monitor_id.toString();
            if (!organizedData[key]) {
                organizedData[key] = [row]; // Initialize the value as an array
            } else {
                const existingAddOnIds = organizedData[key].map(
                    (item) => item._addOnId
                );
                if (
                    existingAddOnIds.filter((id) => id === row._addOnId)
                        .length < 50
                ) {
                    organizedData[key].push(row); // Push the row into the existing array
                } else {
                    const firstIndex = organizedData[key].findIndex(
                        (item) => item._addOnId === row._addOnId
                    );
                    if (firstIndex >= 0) {
                        organizedData[key].splice(firstIndex, 1); // Remove the first occurrence of addOnId
                        organizedData[key].push(row); // Push the new row at the end
                    }
                }
            }
        });
        return organizedData;
    } catch (error) {
        console.error(error);
    }
}

async function updateCore(monitorURL, monitorID) {
    const options = {
        methods: "POST",
        url: monitorURL.url + "/api/hassio/core/update",
        headers: {
            Authorization: "Bearer " + (await getToken()),
            "Content-Type": "application/json",
        },
    };
    try {
        await axios.request(options);
        let coreDB = await R.find("monitor", "id = ?", [monitorID]);
        coreDB.update_available = false;
        await R.store(coreDB);
    } catch (error) {
        console.error(error);
    }
}

async function checkUpdateCore(monitorURL) {
    try {
        const response = await axios.get(
            monitorURL + "/api/hassio/core/info",
            await createConfig()
        );

        return response.data.data.update_available;
    } catch (error) {
        console.error(error);
    }
}

async function pushToken(token) {
    try {
        await R.exec("DELETE FROM token");
        const encryptedToken = encryptToken(token, process.env.ENCRYPTIONKEY);
        let tokenDB = R.dispense("token");
        const bearerToken = {
            token: encryptedToken,
            time: new Date(),
        };
        tokenDB.import(bearerToken);
        await R.store(tokenDB);
    } catch (error) {
        console.error(error);
    }
}

async function getToken() {
    try {
        let token = await R.findOne("token");
        return decryptToken(token._token, process.env.ENCRYPTIONKEY);
    } catch (error) {
        console.error(error);
    }
}

function encryptToken(token, encryptionKey) {
    const iv = cryptoModule.randomBytes(16);

    const keyBuffer = Buffer.from(encryptionKey, "hex");

    const cipher = cryptoModule.createCipheriv("aes-256-cbc", keyBuffer, iv);

    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + encrypted;
}


function decryptToken(encryptedToken, encryptionKey) {
    const iv = Buffer.from(encryptedToken.substr(0, 32), "hex");

    const encrypted = encryptedToken.substr(32);

    const keyBuffer = Buffer.from(encryptionKey, "hex");

    const decipher = cryptoModule.createDecipheriv(
        "aes-256-cbc",
        keyBuffer,
        iv
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

function getAllUsers() {
    try {
        let users = R.findAll("user");
        return users;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getAddOns,
    deleteAddOns,
    createAddons,
    updateAddOns,
    getUsage,
    createAddOnHeartbeat,
    pushToken,
    getToken,
    checkUpdateCore,
    updateCore,
    getAddOnHeartbeat,
    getAllUsers,
};
