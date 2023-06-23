"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var TimerModel_1 = require("../lib/models/TimerModel");
var getTimeParts_1 = __importDefault(require("../lib/helpers/getTimeParts"));
function useTimer(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.initialTime, initialTime = _c === void 0 ? 0 : _c, _d = _b.direction, direction = _d === void 0 ? "forward" : _d, _e = _b.timeToUpdate, timeToUpdate = _e === void 0 ? 1000 : _e, _f = _b.startImmediately, startImmediately = _f === void 0 ? true : _f, _g = _b.lastUnit, lastUnit = _g === void 0 ? "d" : _g, _h = _b.checkpoints, checkpoints = _h === void 0 ? [] : _h, onStart = _b.onStart, onResume = _b.onResume, onPause = _b.onPause, onStop = _b.onStop, onReset = _b.onReset;
    var _j = react_1.useState(__assign({}, getTimeParts_1.default(initialTime < 0 ? 0 : initialTime, lastUnit), { state: 'INITED' })), timerValues = _j[0], setTimerValues = _j[1];
    var timer = react_1.useMemo(function () {
        return new TimerModel_1.TimerModel({
            initialTime: initialTime,
            direction: direction,
            timeToUpdate: timeToUpdate,
            lastUnit: lastUnit,
            checkpoints: checkpoints,
            onChange: function (timerValue) {
                return setTimerValues(function (state) { return (__assign({}, state, timerValue)); });
            },
        });
    }, []);
    var setTime = react_1.useCallback(function (time) { return timer.setTime(time); }, [timer]);
    var getTime = react_1.useCallback(function () { return timer.getTime(); }, [timer]);
    var getTimerState = react_1.useCallback(function () { return timer.state; }, [timer]);
    var setDirection = react_1.useCallback(function (direction) { return timer.setDirection(direction); }, [timer]);
    var setLastUnit = react_1.useCallback(function (lastUnit) { return timer.setLastUnit(lastUnit); }, [timer]);
    var setCheckpoints = react_1.useCallback(function (checkpoints) { return timer.setCheckpoints(checkpoints); }, [timer]);
    var setTimeToUpdate = react_1.useCallback(function (interval) { return timer.setTimeToUpdate(interval); }, [timer]);
    var start = react_1.useCallback(function () { timer.start(); onStart && onStart(); }, [timer, onStart]);
    var stop = react_1.useCallback(function () { timer.stop(); onStop && onStop(); }, [timer, onStop]);
    var pause = react_1.useCallback(function () { timer.pause(); onPause && onPause(); }, [timer, onPause]);
    var reset = react_1.useCallback(function () { timer.reset(); onReset && onReset(); }, [timer, onReset]);
    var resume = react_1.useCallback(function () { timer.resume(); onResume && onResume(); }, [timer, onResume]);
    var controls = react_1.useMemo(function () { return ({
        start: start,
        stop: stop,
        pause: pause,
        reset: reset,
        resume: resume,
        setTime: setTime,
        getTime: getTime,
        getTimerState: getTimerState,
        setDirection: setDirection,
        setLastUnit: setLastUnit,
        setTimeToUpdate: setTimeToUpdate,
        setCheckpoints: setCheckpoints,
    }); }, [
        start, stop, pause, reset, resume,
        setTime, getTime, getTimerState, setDirection, setLastUnit, setTimeToUpdate, setCheckpoints,
    ]);
    react_1.useEffect(function () {
        if (startImmediately) {
            start();
        }
        return function () {
            stop();
        };
    }, []);
    return {
        controls: controls,
        value: timerValues,
    };
}
exports.useTimer = useTimer;
//# sourceMappingURL=useTimer.js.map