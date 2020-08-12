const { sensor, notifier } = require("./src/public-api");
const { throttleTime } = require("rxjs/operators");

const ONE_MINUTE = 1 * 60 * 1000;

/** Start checking for blinks */
sensor.start();

/** Sends warning message when the smoke detector blinked at least 3 times within 5 seconds. */
sensor
  .onAlarmThresholdPassed(3, 5)
  .pipe(throttleTime(ONE_MINUTE))
  .subscribe(() => {
    notifier.sendWarning();
  });
