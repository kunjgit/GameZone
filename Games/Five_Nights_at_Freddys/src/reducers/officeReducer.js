const originalState = {
    leftDoor: false,
    rightDoor: false,
    leftLight: false,
    rightLight: false,
};

export default function office(state = originalState, action) {
    switch (action.type) {
        case "CHANGE_OFFICE_CONFIG":
            if (action.obj === "leftLight" && state.leftDoor) return state;
            if (action.obj === "rightLight" && state.rightDoor) return state;

            if (action.obj === "leftDoor" && !state.leftDoor && state.leftLight)
                return { ...state, leftLight: false, leftDoor: true };
            if (
                action.obj === "rightDoor" &&
                !state.rightDoor &&
                state.rightLight
            )
                return { ...state, rightLight: false, rightDoor: true };
            state[action.obj] = !state[action.obj];
            return state;

        case "CLEAR_DATA":
            return { ...originalState };

        default:
            return state;
    }
}
