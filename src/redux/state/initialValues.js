export const INITIAL_VALUES = "INITIAL_VALUES";

export const initFormVals = (form, data) => async (dispatch) => {
    dispatch({
        type: INITIAL_VALUES,
        data,
        form,
    });
};

const INIT_STATE = {};

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case INITIAL_VALUES:
            if (!action.data) {
                delete state[action.form];
                return state;
            }
            return { ...state,
                ...{
                    [action.form]: action.data
                }
            };
        default:
            return state;
    }
};
export default reducer;