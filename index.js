const { sensor } = require("./src/public-api");

sensor.start();

sensor.onAlarmThresholdPassed().subscribe(() => {
  console.log('alarm');
});
