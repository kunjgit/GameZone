"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Timer_1 = __importDefault(require("./components/Timer/Timer"));
var getTimeParts_1 = __importDefault(require("./lib/helpers/getTimeParts"));
exports.getTimeParts = getTimeParts_1.default;
var useTimer_1 = require("./hook/useTimer");
exports.useTimer = useTimer_1.useTimer;
exports.default = Timer_1.default;
//# sourceMappingURL=index.js.map