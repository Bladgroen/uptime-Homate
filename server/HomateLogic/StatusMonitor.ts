const axios = require("axios");

async function getAddOns() {
    try {
        const config = {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzYWE4YTAwMzQwOWM0YzM5YTAzYjJlZDE0OTJiZTJlNCIsImlhdCI6MTY4MzAzMzQ0NiwiZXhwIjoxOTk4MzkzNDQ2fQ._WqcQa21z3osFhZBYSveaPXiuLFGb6E-4FQFlpp71eM",
                "Content-Type": "application/json",
            },
        };
        const response = await axios.get(
            "https://debugcontroller.homate.ml/api/hassio/addons",
            config
        );
        const data = {};

        const filteredAddons = response.data.data.addons.map((addon) => {
            return {
                name: addon.name,
                slug: addon.slug,
                version: addon.version,
                update_available: addon.update_available,
                state: addon.state,
            };
        });

        return filteredAddons;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getAddOns };
