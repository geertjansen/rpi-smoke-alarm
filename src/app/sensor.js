const rpio = require("rpio");
const { Subject, race } = require("rxjs");
const {
  buffer,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} = require("rxjs/operators");

module.exports = {
  _sensorState: new Subject(),

  _onStateChange: function () {
    return this._sensorState.asObservable().pipe(distinctUntilChanged());
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
    const buffer$ = blinks$.pipe(debounceTime(5000));
    return blinks$.pipe(
      buffer(buffer$),
      map((blinks) => blinks.length),
      filter((blinkCount) => blinkCount > 3)
    );
  },
};
