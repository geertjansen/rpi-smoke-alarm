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
    return this._buttonState.asObservable().pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(console.log),
      map((input) => !input)
    );
  },

  _pollcb(pin) {
    rpio.msleep(20);
    this._buttonState.next(rpio.read(7));
  },

  start: function () {
    rpio.open(7, rpio.INPUT, rpio.PULL_UP);
    rpio.poll(7, this._pollcb.bind(this), rpio.POLL_LOW);
    console.log("button started");
  },

  stop: function () {
    rpio.close(7);
    console.log("button stopped");
  },

  onBright: function () {
    return this._onStateChange().pipe(filter((pressed) => pressed));
  },

  onDim: function () {
    return this._onStateChange().pipe(filter((pressed) => !pressed));
  },
};
