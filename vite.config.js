const { resolve } = require("path");

module.exports = {
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                inventory: resolve(__dirname, "inventory.html"),
                statistics: resolve(__dirname, "statistics.html"),
            },
        },
    },
};
