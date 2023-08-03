import { imgserverURL } from "./api";
import sui from "../assets/images/arcade-panda.6d45b60f713a1bdfd905.png";

const imageURI = "uploads/Onyx";

export const formatDateForPicker = (rawDate) => {
  const date = new Date(rawDate);
  const dateTimeLocalValue = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, -8);
  return dateTimeLocalValue;
};

export const roundTime = (dateTimeLocalValue, to = "hours") => {
  let date = new Date(dateTimeLocalValue);
  switch (to) {
    case "hours":
      date.setMinutes(0);
      break;
    case "days":
      date.setHours(0);
      date.setMinutes(0);
      break;
    case "months":
      date.setDate(1);
      date.setHours(0);
      date.setMinutes(0);
      break;
    default:
      break;
  }
  return date.toString();
};

export const numberShortFormat = (number) => {
  let finalNumber = number;
  let suffixCount = 0;
  const suffixList = ["", "K", "M", "B", "T", "Q"];
  while (finalNumber > 1000) {
    finalNumber = finalNumber / 1000;
    suffixCount += 1;
  }
  finalNumber = Math.round(finalNumber * 1000) / 1000;
  if (suffixCount < suffixList.length) {
    return `${finalNumber}${suffixList[suffixCount]}`;
  } else {
    return `${finalNumber}x10^${suffixCount}`;
  }
};

export const naturalNumber = (number) => {
  if (number === undefined) return "";
  let finalNumber = Math.abs(number);
  if (number) {
    finalNumber = parseInt(finalNumber);
  }
  return finalNumber;
};

const ellipsis = "…";

export const ellipsifyString = (string, length, cut = "middle") => {
  if (!string) {
    return "";
  }
  let pre = "",
    mid = "",
    post = "";
  switch (cut) {
    case "start":
      mid = string.slice(string.length - length);
      pre = ellipsis;
      break;
    case "end":
      mid = string.slice(0, length);
      post = ellipsis;
      break;
    case "middle":
    case "center":
    default:
      pre = string.slice(0, length / 2);
      mid = ellipsis;
      post = string.slice(string.length - length / 2);
      break;
  }
  return `${pre}${mid}${post}`;
};

export const shortenString = (string, cutoff = 0, maxLength = 0) => {
  if (!maxLength) {
    maxLength = cutoff;
  }
  if (cutoff != 0 && string.length > maxLength) {
    return string.slice(0, cutoff) + "...";
  }
  return string;
};

export const padHex = (address, length = 40) => {
  const formatted = address.replace("0x", "");
  if (length - formatted.length > 0) {
    return "0x" + "0".repeat(length - formatted.length) + formatted;
  }
  return "0x" + formatted.substr(0, length);
};

// case-insensitive string compare
export const ciStringCompare = (a, b) => {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, {
        sensitivity: "accent",
      }) === 0
    : a === b;
};

export const ipfsConvert = (imageUrl) => {
  if (typeof imageUrl == "string" && imageUrl.startsWith("ipfs://")) {
    const newImageUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    return newImageUrl;
  } else {
    return imageUrl;
  }
};

export const getUserImageURL = (id, type) => {
  return `${imgserverURL + imageURI}/profiles/${id}/${type}.png`;
};

export const getNFTImageURL = (col_id, id) => {
  return `${imgserverURL + imageURI}/collections/${col_id}/${id}.png`;
};

export const getCollectionImageURL = (
  col_id,
  type = "featured",
  width,
  height
) => {
  // 630b154b147265a6c00dbdae-collection.jpeg
  var resize = ``;
  if (width && height) resize = `resize/${width}x${height}/`;
  return `${
    imgserverURL + resize + imageURI
  }/collections/${col_id}/${type}.png`;
};

export const imageOnErrorHandler = (e, fallback = sui) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallback;
};

export const listingPriceName = (listing) => {
  if (listing.sale_type === "auction") {
    if (listing.sale_price == 0) {
      return "Min Bid";
    }
    return "Current Bid";
  }
  return "Current Price";
};

export const listingPrice = (listing) => {
  if (listing.sale_type === "auction" && listing.sale_price == 0) {
    return listing.auction.min_bid;
  }
  return listing.sale_price;
};

export const listingDisplayPrice = (listing) =>
  mystToSui(listingPrice(listing));

export const mystToSui = (price) => price / 1000000000;

export const suiToMyst = (price) => parseInt(parseFloat(price) * 1000000000);

export const listingToken = (listing) => listing.sale_token.split("::")[2];

export const statusToEffect = (status) => {
  switch (status) {
    case "awaiting review":
      return "half-bad";
    case "under review":
      return "neutral";
    case "denied":
      return "bad";
    case "approved":
      return "good";
    case "verified":
      return "good twice-good";
    default:
      return "";
  }
};

export const getBasePath = (string) => {
  return string.split(/\/\W[^\/]/).join();
};

export const formatSuiItem = ({
  details: { owner, data, reference },
  status,
}) => {
  if (status === "Exists") {
    return {
      owner: owner.ObjectOwner || owner.AddressOwner || "Shared",
      data: data.fields || data,
      id: data.fields.id.id,
      type: data.type,
      packageObjectId: reference?.objectId,
    };
  } else {
    return false;
  }
};

export const paramsToObject = (entries) => {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

export const findFieldByValue = (array, field, value) => {
  return array?.find((element) => {
    return ciStringCompare(element[field], value);
  });
};

export const findIndexByValue = (array, field, value) => {
  return array?.findIndex((element) => {
    return ciStringCompare(element[field], value);
  });
};

export const getNftType = (wholeType) => {
  const types = [];
  wholeType
    .split(/([<>])/)
    .filter(Boolean)
    .forEach((e) => {
      if (e !== "<" && e !== ">") {
        types.push(e);
      }
    });

  let realType = types[0];
  // TODO: include full address
  if (realType.includes("nft::Nft")) {
    realType = types[1].split(", ")[0];
  }
  return realType;
};

export const flattenObjectToArray = (formObject) => {
  const flattenedObject = {};
  const flatArray = [];

  const reflatten = (obj) =>
    Object.keys(obj).forEach((key) => {
      const numObject = {};
      const value = obj[key];
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(flattenedObject, reflatten(value));
      } else {
        if (typeof value === "boolean" && value !== false) {
          flatArray.push(key);
        } else if (typeof value === "string") {
          flatArray.push(value);
        } else if (typeof value === "number") {
          numObject[key] = value;
          flatArray.push(numObject);
        }
      }
    });
  reflatten(formObject);
  return flatArray;
};

export const formatSearchQuery = (
  formValues,
  searchParams,
  setSearchParams
) => {
  const searchQueries = {};
  for (const [key, values] of Object.entries(formValues)) {
    const attribute = {};
    for (const [subKey, subValues] of Object.entries(values)) {
      if (subValues.min || subValues.max) {
        attribute[subKey] = subValues;
      } else {
        const attributeValues = flattenObjectToArray(subValues);
        if (attributeValues.length > 0) {
          attribute[subKey] = attributeValues;
        }
      }
    }
    searchQueries[key] = attribute;
  }

  if (Object.keys(searchQueries).length > 0) {
    for (const [key, values] of Object.entries(searchQueries)) {
      if (Object.keys(values).length > 0) {
        searchParams.set(key, JSON.stringify(values));
      } else {
        searchParams.delete(key);
      }
      setSearchParams(searchParams);
    }
  } else {
    setSearchParams({});
  }
};

export const countDecimals = (input) => {
  if (Math.floor(input.valueOf()) === input.valueOf()) return 0;
  return input.toString().split(".")[1].length || 0;
};

export const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

export const renderDuration = (durationInHours) => {
  const days = Math.floor(durationInHours / 24);
  const hours = durationInHours % 24;
  var durationText = [];

  if (days > 0) durationText.push(pluralize(days, "day"));
  if (hours > 0) durationText.push(pluralize(hours, "hour"));

  return durationText.join(", ");
};
