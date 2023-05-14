const axios = require("axios");

const { R } = require("redbean-node");

async function getAddOns(monitorURL) {
    try {
        const apiURL = monitorURL + "/api/hassio/addons";
        const config = {
            headers: {
                //TODO bearer token is exposed
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYWE4YTAwMzQwOWM0YzM5YTAzYjJlZDE0OTJiZTJlNCIsImlhdCI6MTY4MzAzMzQ0NiwiZXhwIjoxOTk4MzkzNDQ2fQ._WqcQa21z3osFhZBYSveaPXiuLFGb6E-4FQFlpp71eM",
                "Content-Type": "application/json",
            },
        };
        const response = await axios.get(apiURL, config);

        const filteredAddons = response.data.data.addons.map((addon) => {
            return {
                name: addon.name,
                slug: addon.slug,
                version: addon.version,
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
                version: addOn.version,
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

module.exports = { getAddOns, deleteAddOns, createAddons };
