// Types
const LOADING_FULL_SCREEN = "LOADING_FULL_SCREEN";
const LOADED_FULL_SCREEN = "LOADED_FULL_SCREEN";

// actions
export const loadingFullScreen = () => ({
    type: LOADING_FULL_SCREEN,
});

export const loadedFullScreen = () => ({
    type: LOADED_FULL_SCREEN,
});

const INIT_STATE = {
    fullScreen: false,
};

// reducer
export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOADING_FULL_SCREEN:
            return {
                ...state,
                fullScreen: true,
            };
        case LOADED_FULL_SCREEN:
            return {
                ...state,
                fullScreen: false,
            };
        default:
            return state;
    }
};