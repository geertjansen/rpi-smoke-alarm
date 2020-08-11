const rpio = require("rpio");
const { Subject, race, timer } = require("rxjs");
const {
  bufferCount,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mapTo,
  tap,
} = require("rxjs/operators");

module.exports = {
  _sensorState: new Subject(),

  _onStateChange: function () {
    return this._sensorState.asObservable().pipe(
      distinctUntilChanged(),
      tap((onOff) => console.log(`--${onOff}`))
    );
  },

  _pollcb() {
    this._sensorState.next(rpio.read(7));
  },

  start: function () {
    rpio.open(7, rpio.INPUT);
    rpio.poll(7, this._pollcb.bind(this));
    console.log("sensor started");
  },

  stop: function () {
    rpio.close(7);
    console.log("sensor stopped");
  },

  /** blinks at least 3 times within 5 seconds */
  onAlarm: function () {
    const blinks$ = this._onStateChange().pipe(filter((state) => !!state));
    return blinks$.pipe(
      tap(() => "initial blink"),
      exhaustMap(() =>
        race(
          timer(5000).pipe(
            tap(() => console.log("5 seconds gone")),
            mapTo(false)
          ),
          blinks$.pipe(
            bufferCount(2),
            tap(() => console.log("2 more click")),
            mapTo(true)
          )
        )
      ),
      filter((thresholdPassed) => thresholdPassed)
    );
  },
};
