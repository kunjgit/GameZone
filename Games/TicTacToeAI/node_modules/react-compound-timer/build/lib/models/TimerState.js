"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITED = 'INITED';
exports.PLAYING = 'PLAYING';
exports.PAUSED = 'PAUSED';
exports.STOPPED = 'STOPPED';
var TimerState = /** @class */ (function () {
    function TimerState(onChangeStatus) {
        var _this = this;
        if (onChangeStatus === void 0) { onChangeStatus = function (obj) { }; }
        this.state = exports.INITED;
        this.onChange = function () { return onChangeStatus({ state: _this.state }); };
        this.state = exports.INITED;
    }
    TimerState.prototype.getState = function () {
        return this.state;
    };
    TimerState.prototype.setInited = function () {
        if (this.state === exports.INITED) {
            return false;
        }
        this.state = exports.INITED;
        this.onChange();
        return true;
    };
    TimerState.prototype.isInited = function () {
        return this.state === exports.INITED;
    };
    TimerState.prototype.setPlaying = function () {
        if (this.state === exports.PLAYING) {
            return false;
        }
        this.state = exports.PLAYING;
        this.onChange();
        return true;
    };
    TimerState.prototype.isPlaying = function () {
        return this.state === exports.PLAYING;
    };
    TimerState.prototype.setPaused = function () {
        if (this.state !== exports.PLAYING) {
            return false;
        }
        this.state = exports.PAUSED;
        this.onChange();
        return true;
    };
    TimerState.prototype.isPaused = function () {
        return this.state === exports.PAUSED;
    };
    TimerState.prototype.setStopped = function () {
        if (this.state === exports.INITED) {
            return false;
        }
        this.state = exports.STOPPED;
        this.onChange();
        return true;
    };
    TimerState.prototype.isStopped = function () {
        return this.state === exports.STOPPED;
    };
    return TimerState;
}());
exports.default = TimerState;
//# sourceMappingURL=TimerState.js.map