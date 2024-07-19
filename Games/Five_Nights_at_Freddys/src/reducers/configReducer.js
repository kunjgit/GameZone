const originalState = {
    hour: 0,
    isPlaying: true,
    energy: 100,
    time: 7000,
    blackout: false,
    jumpscare: false,
    gameOver: false,
    cameraButtonDisappear: false,
};

export default function config(state = originalState, action) {
    switch (action.type) {
        case "CHANGE_HOUR":
            if (state.jumpscare || state.gameOver) return state;
            return { ...state, hour: state.hour + 1 };
        case "CHANGE_ENERGY":
            if (state.hour === 6) return state;
            return { ...state, energy: state.energy - 1 };
        case "CHANGE_TIME":
            return { ...state, time: action.content };
        case "CHANGE_BLACKOUT":
            return { ...state, blackout: true };
        case "CHANGE_IS_PLAYING":
            return { ...state, isPlaying: action.content };
        case "CHANGE_JUMPSCARE":
            return { ...state, jumpscare: action.animatronic };
        case "CHANGE_CAMERA_BUTTON":
            return { ...state, cameraButtonDisappear: true };
        case "SET_GAME_OVER":
            return { ...state, gameOver: true };
        default:
            return state;
    }
}
