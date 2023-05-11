const axios = require("axios");

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
                url: apiURL + addon.slug + "/stats",
                icon: apiURL + addon.slug + "/icon",
            };
        });

        return filteredAddons;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getAddOns };
