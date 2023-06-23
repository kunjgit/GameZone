function isDifferentPointerPosition(positionA, positionB) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    return positionA.target !== positionB.target || ((ref = positionA.coords) === null || ref === void 0 ? void 0 : ref.x) !== ((ref1 = positionB.coords) === null || ref1 === void 0 ? void 0 : ref1.y) || ((ref2 = positionA.coords) === null || ref2 === void 0 ? void 0 : ref2.y) !== ((ref3 = positionB.coords) === null || ref3 === void 0 ? void 0 : ref3.y) || ((ref4 = positionA.caret) === null || ref4 === void 0 ? void 0 : ref4.node) !== ((ref5 = positionB.caret) === null || ref5 === void 0 ? void 0 : ref5.node) || ((ref6 = positionA.caret) === null || ref6 === void 0 ? void 0 : ref6.offset) !== ((ref7 = positionB.caret) === null || ref7 === void 0 ? void 0 : ref7.offset);
}

export { isDifferentPointerPosition };
