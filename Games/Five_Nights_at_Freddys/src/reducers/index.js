import { combineReducers } from "redux";
import cameraReducer from "./cameraReducer";
import configReducer from "./configReducer";
import officeReducer from "./officeReducer";
import animatronicsReducer from "./animatronicsReducer";

const appReducer = combineReducers({
    cameraReducer,
    configReducer,
    officeReducer,
    animatronicsReducer,
});

export default function rootReducer(state, action) {
    if (action.type === "CLEAR_DATA") {
        state = undefined;
    }

    return appReducer(state, action);
}
