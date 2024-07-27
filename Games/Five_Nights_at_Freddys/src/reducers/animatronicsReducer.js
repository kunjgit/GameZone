const originalState = {
    Freddy: {
        camera: "Stage",
        door: false,
        jumpscare: false,
    },
    Bonnie: {
        camera: "Stage",
        door: false,
        jumpscare: false,
    },
    Chica: {
        camera: "Stage",
        door: false,
        jumpscare: false,
    },
    Foxy: {
        camera: "",
        door: false,
        jumpscare: false,
    },
};

export default function animatronics(state = originalState, action) {
    switch (action.type) {
        // case "CHANGE_FREDDY_CAMERA":
        //   return { ...state, Freddy: { ...state.Freddy, camera: action.content } };
        // case "CHANGE_BONNIE_CAMERA":
        //   return { ...state, Bonnie: { ...state.Bonnie, camera: action.content } };
        // case "CHANGE_CHICA_CAMERA":
        //   return { ...state, Chica: { ...state.Chica, camera: action.content } };
        // case "CHANGE_FOXY_CAMERA":
        //   return { ...state, Foxy: { ...state.Foxy, camera: action.content } };

        case "CHANGE_ANIMATRONIC":
            let animatronicProps = state[action.animatronic];

            animatronicProps = { ...action.animatronicState };
            state[action.animatronic] = animatronicProps;
            return state;
        case "SET_FOXY_NULL":
            return { ...state, Foxy: { ...state.Foxy, camera: null } };
        case "CLEAR_DATA":
            return { ...originalState };
        default:
            return state;
    }
}
