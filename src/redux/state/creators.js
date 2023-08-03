import { SET_CREATORS, REFRESH_CREATOR } from "../../redux/types";
import { getAllCreators } from "../../utils/api";
import update from "immutability-helper";

export const getCreators = () => async (dispatch) => {
  const results = await getAllCreators();

  if (results) {
    dispatch({
      type: SET_CREATORS,
      data: { ...results.data },
    });
  } else {
    dispatch({
      type: SET_CREATORS,
      data: [],
    });
  }
};

const INIT_STATE = [];
const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_CREATORS:
      return { ...state, ...action.data };
    case REFRESH_CREATOR:
      let realIndex = -1;
      state.creators.forEach((creator, index) => {
        if (creator._id == action.id) {
          realIndex = index;
        }
      });
      if (realIndex > -1) {
        return update(state, {
          creators: {
            [realIndex]: {
              followers: {
                $apply: function (x) {
                  return action.followed ? x - 1 : x + 1;
                },
              },
            },
          },
        });
      }
      return state;
    default:
      return state;
  }
};
export default reducer;
