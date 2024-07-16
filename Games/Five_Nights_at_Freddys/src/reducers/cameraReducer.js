const originalState = {
    camera: "Stage",
    isCameraOpen: false,
    areAnimatronicsMoving: false,
};

export default function camera(state = originalState, action) {
    switch (action.type) {
        case "CHANGE_CAMERA":
            return { ...state, camera: action.content };
        case "SET_IS_OPEN":
            return {
                ...state,
                isCameraOpen: state.isCameraOpen ? false : true,
            };
        case "FORCE_CAMERA_CLOSE":
            return { ...state, isCameraOpen: false };
        case "CHANGE_ANIMATRONICS_MOVING":
            return { ...state, areAnimatronicsMoving: action.content };

        default:
            return state;
    }
}
