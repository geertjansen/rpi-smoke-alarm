const { sensor } = require("./src/public-api");

sensor.start();

sensor.onAlarm().subscribe(() => {
  console.log('alarm');
});
