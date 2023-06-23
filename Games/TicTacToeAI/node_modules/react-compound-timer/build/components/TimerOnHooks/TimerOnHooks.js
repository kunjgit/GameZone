"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var useTimer_1 = require("src/hook/useTimer");
exports.TimerOnHooks = function () {
    var _a = useTimer_1.useTimer({ initialTime: 3000 }), value = _a.value, controls = _a.controls;
    react_1.useEffect(function () {
        controls.setCheckpoints([
            {
                time: 0,
                callback: function () { return controls.setDirection('forward'); },
            },
            {
                time: 5000,
                callback: function () { return console.log('5000 with React Hooks'); },
            },
            {
                time: 10000,
                callback: function () { return controls.setDirection('backward'); },
            },
        ]);
    }, []);
    if (!value) {
        return null;
    }
    return (react_1.default.createElement("div", null,
        value.s,
        " s ",
        value.ms));
};
//# sourceMappingURL=TimerOnHooks.js.map