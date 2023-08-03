import {
    searchListings as searchListingsAPI,
    searchCollections as searchCollectionsAPI,
    searchCreators as searchCreatorsAPI,
    searchLaunchpads as searchLaunchpadsAPI,
    getFavoriteNFTs,
    getMyCollections,
    searchLoanListings as searchLoanListingsAPI,
    myListings,
    myAuctions,
    getMyLaunchpads,
    myWonAuctions,
    myBids,
} from "../../utils/api";
import {
    LISTINGS_SEARCH_RESULTS,
    LENDINGS_SEARCH_RESULTS,
    REMOVE_LISTINGS_SEARCH_RESULTS,
    COLLECTIONS_SEARCH_RESULTS,
    AUCTIONS_SEARCH_RESULTS,
    CREATORS_SEARCH_RESULTS,
    LAUNCHPADS_SEARCH_RESULTS,
    LAUNCHPADS_MODULE_RESULTS,
    SEARCH_LOADING,
    SEARCH_FAVORITE_NFT,
    SEARCH_FAVORITE_AUCTION,
    SEARCH_FAVORITE_COLLECTION,
    FOLLOW,
    WON_AUCTIONS,
} from "../types";
import update from "immutability-helper";

export const searchListings = (data) => async (dispatch) => {
    const results = await searchListingsAPI({ ...data,
        sale_type: "sale"
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyListings = (data) => async (dispatch) => {
    const results = await myListings({ ...data,
        sale_type: "sale"
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyBids = (data) => async (dispatch) => {
    const results = await myBids({ ...data
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyAuctions = (data) => async (dispatch) => {
    const results = await myAuctions({ ...data,
        sale_type: "auction"
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchWonAuctions = () => async (dispatch) => {
    const results = await myWonAuctions();
    if (results) {
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyFavourites = (data) => async (dispatch) => {
    const results = await getFavoriteNFTs(data);
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyCollections = (data) => async (dispatch) => {
    const results = await getMyCollections(data);
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: COLLECTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: COLLECTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchCollections = (data) => async (dispatch) => {
    const results = await searchCollectionsAPI(data);
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: COLLECTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: COLLECTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchCollectionListings = (data) => async (dispatch) => {
    const results = await searchListingsAPI({
        ...data,
        ...{
            nft_collection: data.id
        },
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LISTINGS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchAuctions = (data) => async (dispatch) => {
    const results = await searchListingsAPI({ ...data,
        sale_type: "auction"
    });
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: AUCTIONS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchCreators = (data) => async (dispatch) => {
    const results = await searchCreatorsAPI(data);
    if (results) {
        // todo: pagination stuff
        dispatch({
            type: CREATORS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: CREATORS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchLaunchpads = (data, custom) => async (dispatch) => {
    const results = await searchLaunchpadsAPI({ ...data
    });
    if (results) {
        // todo: pagination stuff
        if (custom) {
            dispatch({
                type: LAUNCHPADS_MODULE_RESULTS,
                data: results.data,
                custom: custom,
            });
        } else {
            dispatch({
                type: LAUNCHPADS_SEARCH_RESULTS,
                data: results.data,
            });
        }
    } else {
        dispatch({
            type: LAUNCHPADS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchMyLaunchpads = (data) => async (dispatch) => {
    const results = await getMyLaunchpads({ ...data
    });
    if (results) {
        dispatch({
            type: LAUNCHPADS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LAUNCHPADS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchLoanListings = (data) => async (dispatch) => {
    const results = await searchLoanListingsAPI(data);
    if (results) {
        dispatch({
            type: LENDINGS_SEARCH_RESULTS,
            data: results.data,
        });
    } else {
        dispatch({
            type: LENDINGS_SEARCH_RESULTS,
            data: stateResult,
        });
    }
};

export const searchLoading = (state) => async (dispatch) => {
    dispatch({
        type: SEARCH_LOADING,
        loading: state,
    });
};
const stateResult = {
    results: [],
    count: 0,
    pages: 0,
    curPage: 0
};

const INIT_STATE = {
    listings: stateResult,
    lendings: stateResult,
    collections: stateResult,
    auctions: stateResult,
    creators: stateResult,
    launchpads: stateResult,
    launchpads_custom: {
        featured: stateResult,
        upcoming: stateResult,
        ended: stateResult,
        live: stateResult,
    },
};

const reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LISTINGS_SEARCH_RESULTS:
            // todo: pagination stuff
            return { ...state,
                listings: { ...action.data
                }
            };
        case REMOVE_LISTINGS_SEARCH_RESULTS:
            state.listings.results.forEach((item, index) => {
                if (item._id === action.id) {
                    delete state.listings.results[index];
                }
            });
            return state;
        case LENDINGS_SEARCH_RESULTS:
            return { ...state,
                lendings: { ...action.data
                }
            };
        case COLLECTIONS_SEARCH_RESULTS:
            // todo: pagination stuff
            return { ...state,
                collections: { ...action.data
                }
            };
        case AUCTIONS_SEARCH_RESULTS:
            // todo: pagination stuff
            return { ...state,
                auctions: { ...action.data
                }
            };
        case CREATORS_SEARCH_RESULTS:
            // todo: pagination stuff
            return { ...state,
                creators: { ...action.data
                }
            };
        case LAUNCHPADS_SEARCH_RESULTS:
            // todo: pagination stuff
            return { ...state,
                launchpads: { ...action.data
                }
            };
        case LAUNCHPADS_MODULE_RESULTS:
            const lastPage = state.launchpads_custom[action.custom].curPage;
            return update(state, {
                launchpads_custom: {
                    [action.custom]: {
                        results: action.data.curPage > lastPage ?
                            {
                                $push: action.data.results,
                            } :
                            {
                                $set: action.data.results
                            },
                        count: {
                            $set: action.data.count,
                        },
                        pages: {
                            $set: action.data.pages,
                        },
                        curPage: {
                            $set: action.data.curPage,
                        },
                    },
                },
            });
        case SEARCH_LOADING:
            return { ...state,
                loading: !!action.loading
            };
        case SEARCH_FAVORITE_NFT:
            let realNFTIndex = -1;
            state.listings.results.forEach((listing, index) => {
                if (listing.nft._id == action.nft) {
                    realNFTIndex = index;
                }
            });
            if (realNFTIndex > -1) {
                return update(state, {
                    listings: {
                        results: {
                            [realNFTIndex]: {
                                nft: {
                                    favorites: {
                                        $apply: function(x) {
                                            return action.favorited ? x - 1 : x + 1;
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            }
            return state;
        case SEARCH_FAVORITE_AUCTION:
            let realAuctionIndex = -1;
            state.auctions.results.forEach((listing, index) => {
                if (listing.nft._id == action.nft) {
                    realAuctionIndex = index;
                }
            });
            if (realAuctionIndex > -1) {
                return update(state, {
                    auctions: {
                        results: {
                            [realAuctionIndex]: {
                                nft: {
                                    favorites: {
                                        $apply: function(x) {
                                            return action.favorited ? x - 1 : x + 1;
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            }
            return state;
        case SEARCH_FAVORITE_COLLECTION:
            let realCollectionIndex = -1;
            state.collections.results.forEach((collection, index) => {
                if (collection._id == action.collection) {
                    realCollectionIndex = index;
                }
            });
            if (realCollectionIndex > -1) {
                return update(state, {
                    collections: {
                        results: {
                            [realCollectionIndex]: {
                                favorites: {
                                    $apply: function(x) {
                                        return action.favorited ? x - 1 : x + 1;
                                    },
                                },
                            },
                        },
                    },
                });
            }
            return state;
        case FOLLOW:
            let realCreatorIndex = -1;
            state.creators.results.forEach((creator, index) => {
                if (creator._id == action.creator) {
                    realCreatorIndex = index;
                }
            });
            if (realCreatorIndex > -1) {
                return update(state, {
                    creators: {
                        results: {
                            [realCreatorIndex]: {
                                followers: {
                                    $apply: function(x) {
                                        return action.followed ? x - 1 : x + 1;
                                    },
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