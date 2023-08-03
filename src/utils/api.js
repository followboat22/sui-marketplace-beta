//
import axios from "axios";
import ToastPopup from "../components/utils/ToastPopup";
import {
    IS_PROD,
    IS_TESTNET
} from "../utils/environments";

let instance = false;

export const setBearerToken = (newToken) => window.localStorage.setItem("jwt", newToken);
export const getBearerToken = () => window.localStorage.getItem("jwt") || false;
export const clearBearerToken = () => window.localStorage.removeItem("jwt");

export const imgserverURL = IS_PROD ?
    "https://s3.gamexchange.app/" :
    "http://70.70.62.21:33339/";

const ImageServerInstance = (token) => {
    let completeBearerToken = null;
    const localToken = getBearerToken();
    if (token) {
        completeBearerToken = `Bearer ${token}`;
    } else if (localToken) {
        completeBearerToken = `Bearer ${localToken}`;
    }

    return axios.create({
        baseURL: imgserverURL,
        headers: {
            common: {
                Authorization: completeBearerToken,
            },
        },
    });
};

export const refreshInstance = () => {
    let completeBearerToken = null;
    const localToken = getBearerToken();
    if (localToken) {
        completeBearerToken = `Bearer ${localToken}`;
    }

    instance = axios.create({
        baseURL: IS_TESTNET ?
            "https://beta-api.Onyx.gg/" :
            IS_PROD ?
            "https://api.Onyx.gg/" :
            "http://70.70.62.21:9001/",
        headers: {
            common: {
                Authorization: completeBearerToken,
            },
        },
    });

    // response interceptor to catch any uncaught async errors and display them as a Toast message
    instance.interceptors.response.use(undefined, (err) => {
        if (err.response) {
            const status = err.response.status || null;
            const message =
                typeof err.response.data === "object" ?
                err.response.data.message :
                err.response.data;
            ToastPopup(`${status}: ${message}`, "error");
        } else {
            ToastPopup("An unknown error has occurred", "error");
        }

        return Promise.reject(err);
    });
};
refreshInstance();

const webv1 = "/web/v1";
const usersURI = webv1 + "/users";
const listingsURI = webv1 + "/listings";
const loanListingsURI = webv1 + "/lendings";
const launchpadsURI = webv1 + "/launchpads";
const nftURI = webv1 + "/nfts";
const collectionsURI = webv1 + "/collections";
const subscribersURI = webv1 + "/subscribers";
const imagesURI = webv1 + "/images";

// Users
export const signIn = (data) => instance.post(usersURI + "/sign_up", data);
// TODO: until suiwallet has signing abilities
export const suiSignIn = (address) =>
    instance.post(usersURI + "/dev_sign_up", {
        address
    });
export const getCurrentUser = () => instance.get(usersURI + "/current");
export const updateUser = (user) => instance.patch(usersURI + "/updateUser", user);
export const updateUserSafe = (user) =>
    instance.patch(usersURI + "/updateUserSafe", user);
export const toggleFollowUser = (id) => instance.get(usersURI + `/follow/${id}`);
export const getAllCreators = () => instance.get(usersURI + `/creators`);
export const getCreator = (id) => instance.get(usersURI + `/creator/${id}`);
export const searchCreators = (params) => instance.get(usersURI + "/search", {
    params
});
export const asyncValidateDuplicateField = (params) =>
    instance.get(usersURI + "/validate", {
        params
    });

// Settings
export const getSettings = () => instance.get(webv1 + "/services/settings");

// Listings
export const searchListings = (params) =>
    instance.get(listingsURI + "/search", {
        params
    });
export const myListings = (params) => instance.get(listingsURI + "/my", {
    params
});
export const myAuctions = () => instance.get(listingsURI + "/my-auctions");
export const myWonAuctions = () => instance.get(listingsURI + "/my-won-auctions");
export const myBids = () => instance.get(listingsURI + "/my-bids");
export const getRandom = () => instance.get(listingsURI + "/random");
export const getListing = (id) => instance.get(listingsURI + `/id/${id}`);
export const createListing = (data) => instance.post(listingsURI + `/create`, data);
export const updateListing = (id) => instance.put(listingsURI + `/id/${id}`);
export const toggleFavoriteNFT = (id) => instance.get(usersURI + `/favoriteNFTs/${id}`);
export const getFavoriteNFTs = (params) =>
    instance.get(usersURI + `/favoriteNFTs`, {
        params
    });

// Loaning
export const searchLoanListings = (params) => instance.get(`${loanListingsURI}/search`);
export const getLoanListing = (id) => instance.get(loanListingsURI + `/id/${id}`);
export const updateLoanListing = (id) => instance.put(loanListingsURI + `/id/${id}`);
export const createLoanListing = (tx) => instance.get(`${loanListingsURI}/create/${tx}`);
export const myRentalListings = () =>
    instance.get(loanListingsURI + "/my-rental-listings");
export const myLoanListings = () => instance.get(loanListingsURI + "/my-loan-listings");

// NFTs
export const getNFT = (id) => instance.get(`${nftURI}/id/${id}`);
export const createNFT = (data) => instance.post(nftURI, data);
export const announceNFT = (object_id, mongo_id, tx_id) =>
    instance.put(nftURI + `/id/${object_id}`, {
        mongo_id,
        tx_id
    });
export const announceNFTs = (tx_id) => instance.put(nftURI + `/create/${tx_id}`);

// Collections
export const searchCollections = (params) =>
    instance.get(collectionsURI + "/search", {
        params
    });
export const getCollection = (id) => instance.get(collectionsURI + `/id/${id}`);
export const logCollection = (data) =>
    instance.post(collectionsURI + "/halfRecord", data);
export const createCollection = (data) => instance.post(collectionsURI + `/create`, data);
export const addCollection = (data) => instance.post(collectionsURI + `/add`, data);
export const updateCollection = (id, data) =>
    instance.put(collectionsURI + `/id/${id}`, data);
export const getMyCollection = (id) =>
    instance.get(collectionsURI + `/myCollection/${id}`);
export const getMyCollections = () => instance.get(collectionsURI + `/myCollections`);
export const getAllCollections = (params) =>
    instance.get(collectionsURI + `/allCollections`, {
        params
    });
export const getTopCollections = () => instance.get(collectionsURI + `/topCollections`);
export const toggleFavoriteCollection = (id) =>
    instance.get(usersURI + `/favoriteCollections/${id}`);
export const getFavoriteCollections = (page, pageSize) =>
    instance.get(usersURI + `/favoriteCollections`, {
        params: {
            pageSize,
            page
        }
    });

// Launchpads
export const searchLaunchpads = (params) =>
    instance.get(launchpadsURI + "/search", {
        params
    });
export const getLaunchpad = (id) => instance.get(launchpadsURI + `/id/${id}`);
export const getLaunchpadsForCollection = (id) =>
    instance.get(launchpadsURI + `/collection/${id}`);
export const getMyLaunchpads = () => instance.get(launchpadsURI + `/myLaunchpads`);
export const getAllLaunchpads = (params) =>
    instance.get(collectionsURI + `/allLaunchpads`, {
        params
    });
export const createLaunchpad = (data) => instance.post(launchpadsURI + `/create`, data);
export const createLaunchpadContract = (tx, id) =>
    instance.put(launchpadsURI + `/create`, {
        tx,
        id
    });
export const updateLaunchpad = (id, data) =>
    instance.put(launchpadsURI + `/id/${id}`, data);
export const updateLaunchpadListings = (id, saleIndex) =>
    instance.put(launchpadsURI + `/fetchInfo/${id}`, {
        saleIndex
    });

// Subscribers
export const emailSubscribe = (email) =>
    instance.post(subscribersURI + "/add", {
        email
    });

// Image Server API
export const uploadCollectionImage = (
    token,
    collection_id,
    photo,
    imageType = "featured" /*|| "logo"*/
) => {
    const data = new FormData();
    data.append("photo", photo, photo.name);
    return ImageServerInstance(token).post(
        imagesURI + `/upload/Onyx/collections/${collection_id}/${imageType}`,
        data, {
            imageType,
            headers: {
                "Content-Type": "multipart/form-data; boundary=${data._boundary}",
            },
        }
    );
};
export const uploadNFTImage = (token, collection_id, nft_id, photo) => {
    const data = new FormData();
    data.append("photo", photo, photo.name);
    return ImageServerInstance(token).post(
        imagesURI + `/upload/Onyx/collections/${collection_id}/nft/${nft_id}`,
        data, {
            headers: {
                "Content-Type": "multipart/form-data; boundary=${data._boundary}",
            },
        }
    );
};

export const uploadUserImage = (
    token,
    profile_id,
    photo,
    imageType = "avatar" /*||"cover"*/
) => {
    const data = new FormData();
    data.append("photo", photo, photo.name);
    return ImageServerInstance(token).post(
        imagesURI + `/upload/Onyx/profiles/${profile_id}/${imageType}`,
        data, {
            imageType,
            headers: {
                "Content-Type": "multipart/form-data; boundary=${data._boundary}",
            },
        }
    );
};