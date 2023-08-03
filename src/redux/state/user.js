import {
    mergeAction
} from "../";
import {
    LOGIN,
    LOGOUT,
    FAVORITE_NFT,
    FAVORITE_COLLECTION,
    WIN_LISTING,
    SEARCH_FAVORITE_NFT,
    SEARCH_FAVORITE_AUCTION,
    SEARCH_FAVORITE_COLLECTION,
    FOLLOW,
    REFRESH_CREATOR,
} from "../../redux/types";
import {
    toggleFavoriteNFT,
    toggleFavoriteCollection,
    toggleFollowUser,
    updateUser,
    myWonAuctions,
    getCurrentUser as getCurrentUserAPI,
    getBearerToken,
    clearBearerToken,
    refreshInstance,
} from "../../utils/api";
import ToastPopup from "../../components/utils/ToastPopup";

// export const connect = (provider) => async (dispatch) => {
//   setProvider(provider);
//   dispatch({
//     type: CONNECTED,
//     value: true,
//   });
// };

export const getCurrentUser = () => (dispatch) => {
    let bearerToken = getBearerToken();
    if (bearerToken) {
        return getCurrentUserAPI()
            .then((res) => {
                const user = res.data.data.user;
                if (user._id) {
                    refreshInstance();
                    dispatch({
                        type: LOGIN,
                        user,
                    });
                }
            })
            .catch((err) => {
                // if user is unauthenticated delete the token from local storage
                // and force them to log in again
                if (
                    err?.response?.status === 401 ||
                    err?.response?.data?.message === "invalid token" ||
                    err?.response?.data?.message === "jwt malformed"
                ) {
                    clearBearerToken();
                }
                ToastPopup(`The following error occured getting current user... ${err}`, "error");
            });
    }
};

export const updateUserProfile = (user, to) => (dispatch) =>
    new Promise((resolve, reject) => {
        updateUser(user)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(Error(`Error: ${error}`));
            });
    });

export const favoriteNFT = (nft, favorited) => (dispatch) => {
    toggleFavoriteNFT(nft).then(() => {
        dispatch({
            type: FAVORITE_NFT,
            nft,
            favorited
        });
        dispatch({
            type: SEARCH_FAVORITE_NFT,
            nft,
            favorited
        });
        dispatch({
            type: SEARCH_FAVORITE_AUCTION,
            nft,
            favorited
        });
    });
};

export const favoriteCollection = (collection, favorited) => (dispatch) => {
    toggleFavoriteCollection(collection).then(() => {
        dispatch({
            type: FAVORITE_COLLECTION,
            collection,
            favorited
        });
        dispatch({
            type: SEARCH_FAVORITE_COLLECTION,
            collection,
            favorited
        });
    });
};

export const followUser = (id, followed) => (dispatch) => {
    toggleFollowUser(id).then(() => {
        dispatch({
            type: FOLLOW,
            id,
            followed
        });
        dispatch({
            type: REFRESH_CREATOR,
            id,
            followed
        });
    });
};

const INIT_STATE = {};
const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGOUT:
            return INIT_STATE;
        case LOGIN:
            return { ...state,
                ...action.user
            };
        case FAVORITE_NFT:
            let new_favourite_nfts = state.favorite_nfts;
            action.favorited ?
                (new_favourite_nfts = new_favourite_nfts.filter((fav) => fav !== action.nft)) :
                new_favourite_nfts.push(action.nft);
            return { ...state,
                favorite_nfts: new_favourite_nfts
            };
        case FAVORITE_COLLECTION:
            let new_favourite_collections = state.favorite_collections;
            action.favorited ?
                (new_favourite_collections = new_favourite_collections.filter(
                    (fav) => fav !== action.collection
                )) :
                new_favourite_collections.push(action.collection);
            return { ...state,
                favorite_collections: new_favourite_collections
            };
        case FOLLOW:
            let following = state.following;
            action.followed ?
                (following = following.filter((fol) => fol !== action.id)) :
                following.push(action.id);
            return { ...state,
                following
            };
        case WIN_LISTING:
            state.auctions = state.auctions.filter((auction) => auction._id !== action._id);
            return mergeAction(state, action);
        default:
            return state;
    }
};

export default reducer;