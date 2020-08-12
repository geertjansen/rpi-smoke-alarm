const rpio = require("rpio");
const { Subject, race, timer } = require("rxjs");
const {
  bufferCount,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mapTo,
  take,
} = require("rxjs/operators");
const logger = require("./logger");

module.exports = {
  _sensorState: new Subject(),

  _onStateChange: function () {
    return this._sensorState.asObservable().pipe(distinctUntilChanged());
  },

  _pollcb() {
    const state = rpio.read(7);

    logger.debug(`state=${state}`);

    this._sensorState.next(state);
  },

  start: function () {
    rpio.open(7, rpio.INPUT);
    rpio.poll(7, this._pollcb.bind(this));

    logger.log("sensor started");
  },

  stop: function () {
    rpio.close(7);

    logger.log("sensor stopped");
  },

  onAlarmThresholdPassed: function (threshold, duration) {
    const blinks$ = this._onStateChange().pipe(filter((state) => !!state));
    return blinks$.pipe(
      exhaustMap(() =>
        race(
          timer(duration * 1000).pipe(mapTo(false)),
          blinks$.pipe(bufferCount(threshold - 1), take(1), mapTo(true))
        )
      ),
      filter((thresholdPassed) => thresholdPassed)
    );
  },
};
