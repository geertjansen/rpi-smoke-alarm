const { sensor } = require("./src/public-api");

sensor.start();

/** Blinks at least 3 times within 5 seconds */
sensor.onAlarmThresholdPassed(3, 5).subscribe(() => {
  console.log('alarm');
});
