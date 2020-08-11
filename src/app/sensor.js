const rpio = require("rpio");
const { Subject } = require("rxjs");
const {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} = require("rxjs/operators");

module.exports = {
  _sensorState: new Subject(),

  _onStateChange: function () {
    return this._sensorState.asObservable().pipe(
      distinctUntilChanged(),
      tap(console.log)
    );
  },

  _pollcb(pin) {
    rpio.msleep(20);
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

  onBright: function () {
    return this._onStateChange().pipe(filter((pressed) => pressed));
  },

  onDim: function () {
    return this._onStateChange().pipe(filter((pressed) => !pressed));
  },
};
