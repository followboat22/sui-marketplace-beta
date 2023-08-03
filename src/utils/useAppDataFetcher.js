// The goal of this hook is to handle fetching the data needed for App.jsx
// Data will be fetched on first build, but may also be fetched in other situations
// such as when the user logs out and the user store changes

import {
    useLayoutEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getBearerToken
} from "../utils/api";
import {
    getCurrentUser
} from "../redux/state/user";
import {
    loadingFullScreen,
    loadedFullScreen
} from "../redux/state/loading";

const getEssentialAppData = (dispatch, {
    _id
}) => {
    // check if there is a token available
    // if there is not a token then our work here is done
    // if there is a token then attempt to get current user data
    let bearerToken = getBearerToken();
    if (!bearerToken) return;
    if (!_id) {
        dispatch(loadingFullScreen());
        dispatch(getCurrentUser())
            .then(() => {
                dispatch(loadedFullScreen());
            })
            .catch(() => {
                dispatch(loadedFullScreen());
            });
    }
};

const useAppDataFetcher = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const {
        _id
    } = user;

    useLayoutEffect(() => {
        // this is only run on first load and if the user object changes
        getEssentialAppData(dispatch, {
            _id
        });
    }, [dispatch, _id]);
};

export default useAppDataFetcher;