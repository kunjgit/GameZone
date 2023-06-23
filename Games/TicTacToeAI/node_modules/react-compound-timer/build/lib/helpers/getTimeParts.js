"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTimeParts(time, lastUnit) {
    var units = ['ms', 's', 'm', 'h', 'd'];
    var lastUnitIndex = units.findIndex(function (unit) { return unit === lastUnit; });
    var dividers = [1000, 60, 60, 24, 1];
    var dividersAcc = [1, 1000, 60000, 3600000, 86400000];
    var startValue = {
        ms: 0,
        s: 0,
        m: 0,
        h: 0,
        d: 0,
    };
    var output = units.reduce(function (obj, unit, index) {
        if (index > lastUnitIndex) {
            obj[unit] = 0;
        }
        else if (index === lastUnitIndex) {
            obj[unit] = Math.floor(time / dividersAcc[index]);
        }
        else {
            obj[unit] = Math.floor(time / dividersAcc[index]) % dividers[index];
        }
        return obj;
    }, startValue);
    return output;
}
exports.default = getTimeParts;
//# sourceMappingURL=getTimeParts.js.map