const { sensor } = require("./src/public-api");

sensor.start();

sensor.onBright().subscribe();
