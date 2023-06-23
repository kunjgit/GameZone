"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getTimeParts_1 = __importDefault(require("../helpers/getTimeParts"));
var now_1 = __importDefault(require("../helpers/now"));
var TimerState_1 = __importDefault(require("./TimerState"));
var TimerModel = /** @class */ (function () {
    function TimerModel(_a) {
        var initialTime = _a.initialTime, direction = _a.direction, timeToUpdate = _a.timeToUpdate, lastUnit = _a.lastUnit, checkpoints = _a.checkpoints, onChange = _a.onChange;
        this.internalTime = now_1.default();
        this.initialTime = initialTime;
        this.time = initialTime;
        this.direction = direction;
        this.timeToUpdate = timeToUpdate;
        this.lastUnit = lastUnit;
        this.checkpoints = checkpoints;
        this.innerState = new TimerState_1.default(onChange);
        this.onChange = onChange;
        this.timerId = null;
    }
    Object.defineProperty(TimerModel.prototype, "state", {
        get: function () {
            return this.innerState.getState();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimerModel.prototype, "timeParts", {
        get: function () {
            return this.getTimeParts(this.computeTime());
        },
        enumerable: true,
        configurable: true
    });
    TimerModel.prototype.getTimeParts = function (time) {
        return getTimeParts_1.default(time, this.lastUnit);
    };
    TimerModel.prototype.setTime = function (time) {
        this.internalTime = now_1.default();
        this.initialTime = time;
        this.time = this.initialTime;
        this.onChange(this.getTimeParts(this.time));
    };
    TimerModel.prototype.getTime = function () {
        return this.time;
    };
    TimerModel.prototype.setLastUnit = function (lastUnit) {
        if (this.innerState.isPlaying()) {
            this.pause();
            this.lastUnit = lastUnit;
            this.resume(true);
        }
        else {
            this.lastUnit = lastUnit;
        }
    };
    TimerModel.prototype.setTimeToUpdate = function (interval) {
        if (this.innerState.isPlaying()) {
            this.pause();
            this.timeToUpdate = interval;
            this.resume();
        }
        else {
            this.timeToUpdate = interval;
        }
    };
    TimerModel.prototype.setDirection = function (direction) {
        this.direction = direction;
    };
    TimerModel.prototype.setCheckpoints = function (checkpoints) {
        this.checkpoints = checkpoints;
    };
    TimerModel.prototype.start = function () {
        if (this.innerState.setPlaying()) {
            this.setTimerInterval(true);
        }
    };
    TimerModel.prototype.resume = function (callImmediately) {
        if (callImmediately === void 0) { callImmediately = false; }
        if (!this.innerState.isStopped() && this.innerState.setPlaying()) {
            this.setTimerInterval(callImmediately);
        }
    };
    TimerModel.prototype.pause = function () {
        if (this.innerState.setPaused()) {
            clearInterval(this.timerId);
        }
    };
    TimerModel.prototype.stop = function () {
        if (this.innerState.setStopped()) {
            clearInterval(this.timerId);
        }
    };
    TimerModel.prototype.reset = function () {
        this.time = this.initialTime;
        this.onChange(this.getTimeParts(this.time));
    };
    TimerModel.prototype.setTimerInterval = function (callImmediately) {
        var _this = this;
        if (callImmediately === void 0) { callImmediately = false; }
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.internalTime = now_1.default();
        var repeatedFunc = function () {
            var oldTime = _this.time;
            var updatedTime = _this.computeTime();
            _this.onChange(_this.getTimeParts(updatedTime));
            _this.checkpoints.map(function (_a) {
                var time = _a.time, callback = _a.callback;
                var checkForForward = time > oldTime && time <= updatedTime;
                var checkForBackward = time < oldTime && time >= updatedTime;
                var checkIntersection = _this.direction === 'backward' ?
                    checkForBackward :
                    checkForForward;
                if (checkIntersection) {
                    callback();
                }
            });
        };
        callImmediately && this.onChange(this.getTimeParts(this.time));
        this.timerId = window.setInterval(repeatedFunc, this.timeToUpdate);
    };
    TimerModel.prototype.computeTime = function () {
        if (this.innerState.isPlaying()) {
            var currentInternalTime = now_1.default();
            var delta = Math.abs(currentInternalTime - this.internalTime);
            switch (this.direction) {
                case 'forward':
                    this.time = this.time + delta;
                    this.internalTime = currentInternalTime;
                    return this.time;
                case 'backward': {
                    this.time = this.time - delta;
                    this.internalTime = currentInternalTime;
                    if (this.time < 0) {
                        this.stop();
                        return 0;
                    }
                    return this.time;
                }
                default:
                    return this.time;
            }
        }
        return this.time;
    };
    return TimerModel;
}());
exports.TimerModel = TimerModel;
//# sourceMappingURL=TimerModel.js.map