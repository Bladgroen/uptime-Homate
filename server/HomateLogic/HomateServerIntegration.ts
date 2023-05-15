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
        const response2 = await axios.post(
            "https://debugcontroller.homate.ml/api/hassio/core/restart",
            config
        );
        console.log(
            "🚀 ~ file: HomateServerIntegration.ts:20 ~ getAddOns ~ response2:",
            response2
        );

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

async function updateAddOns(slug, monitorURL, addonID) {
    try {
        const options = {
            method: "POST",
            url: "https://debugcontroller.homate.ml/api/hassio/store/addons/core_ssh/update",
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYWE4YTAwMzQwOWM0YzM5YTAzYjJlZDE0OTJiZTJlNCIsImlhdCI6MTY4MzAzMzQ0NiwiZXhwIjoxOTk4MzkzNDQ2fQ._WqcQa21z3osFhZBYSveaPXiuLFGb6E-4FQFlpp71eM",
                "Content-Type": "application/json",
            },
        };

        await axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });

        // if (response.status === 200) {
        //     let addonDB = await R.find("add_ons", addonID);
        //     addonDB.update_available = 0;
        //     await R.store(addonDB);
        // } else {
        //     throw new Error(response.message);
        // }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getAddOns, deleteAddOns, createAddons, updateAddOns };
