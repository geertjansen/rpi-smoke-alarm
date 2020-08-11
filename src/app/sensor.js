const rpio = require("rpio");
const { Subject } = require("rxjs");
const {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} = require("rxjs/operators");

module.exports = {
  _sensorState: new Subject(),

  _onStateChange: function () {
    return this._sensorState.asObservable().pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(console.log),
      map((input) => !input)
    );
  },

  _pollcb(pin) {
    rpio.msleep(20);
    this._sensorState.next(rpio.read(7));
  },

  start: function () {
    rpio.open(7, rpio.INPUT, rpio.PULL_UP);
    rpio.poll(7, this._pollcb.bind(this), rpio.POLL_LOW);
    console.log("sensor started");
  },

  stop: function () {
    rpio.close(7);
    console.log("sensor stopped");
  },

  onBright: function () {
    return this._onStateChange().pipe(filter((pressed) => pressed));
  },

  onDim: function () {
    return this._onStateChange().pipe(filter((pressed) => !pressed));
  },
};
