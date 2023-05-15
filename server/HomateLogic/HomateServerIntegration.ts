const axios = require("axios");

const { R } = require("redbean-node");

const config = {
    headers: {
        //TODO bearer token is exposed
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYWE4YTAwMzQwOWM0YzM5YTAzYjJlZDE0OTJiZTJlNCIsImlhdCI6MTY4MzAzMzQ0NiwiZXhwIjoxOTk4MzkzNDQ2fQ._WqcQa21z3osFhZBYSveaPXiuLFGb6E-4FQFlpp71eM",
        "Content-Type": "application/json",
    },
};

async function getAddOns(monitorURL) {
    try {
        const apiURL = monitorURL + "/api/hassio/addons";

        const response = await axios.get(apiURL, config);

        const filteredAddons = response.data.data.addons.map((addon) => {
            return {
                name: addon.name,
                slug: addon.slug,
                update_available: addon.update_available,
                state: addon.state,
                url: apiURL + "/" + addon.slug + "/stats",
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
                active: addOn.state === "started",
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

const bearer =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYWE4YTAwMzQwOWM0YzM5YTAzYjJlZDE0OTJiZTJlNCIsImlhdCI6MTY4MzAzMzQ0NiwiZXhwIjoxOTk4MzkzNDQ2fQ._WqcQa21z3osFhZBYSveaPXiuLFGb6E-4FQFlpp71eM";

async function updateAddOns(slug, monitorURL, addonID) {
    const options = {
        method: "POST",
        url: monitorURL.url + "/api/hassio/store/addons/" + slug + "/update",
        headers: {
            Authorization: "Bearer " + bearer,
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

async function getUsage(monitorURL) {
    try {
        let response = await axios.get(
            monitorURL.url + "/api/hassio/core/stats",
            config
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

module.exports = {
    getAddOns,
    deleteAddOns,
    createAddons,
    updateAddOns,
    getUsage,
};
