import {
  isValidSuiObjectId,
  JsonRpcProvider,
  devnetConnection,
  LocalTxnDataSerializer,
} from "@mysten/sui.js";
// import { ethos } from "ethos-wallet-beta";
import { ethos } from "ethos-connect";
import { IS_TESTNET } from "../utils/environments";
import {
  padHex,
  suiToMyst,
  formatSuiItem,
  ipfsConvert,
} from "../utils/formats";
import { getInternalType, isStandardized } from "./originByte";
import { filter } from "../utils/performance";

export const SUI = "0x2::sui::SUI";
export const network = IS_TESTNET
  ? "https://fullnode.testnet.sui.io:443"
  : "https://sui-devnet.shinami.com/api/v1/42648c77f0f1a6eb5580ee58f4de797f";

let provider = new JsonRpcProvider({
  fullnode: network,
  faucet: network,
  websocket: network,
});
let serializer = new LocalTxnDataSerializer(provider);
let signer = false;

let settings = {
  nft_bytes: "",
  nft_package_id: "",
  allowlist: "",
  package_id: "",
  module_name: "",
  market_address: "",
  admin_address: "",
  tags: [],
  collateralFee: 0,
};

let defaultDetails = {
  packageObjectId: settings.package_id,
  typeArguments: [],
};

let userAddress = false;
let gasObjects = [];

export const updateGasObjects = (newObjects) => {
  gasObjects = newObjects;
};

export const getSerializer = () => serializer;

export const updateSettings = async (newSettings) => {
  const marketInfo = await getObjectInfo(newSettings.market_address);
  settings = newSettings;
  settings.collateralFee = parseInt(marketInfo.data.collateralFee);
  settings.package_id = marketInfo.type.split("::")[0];
  defaultDetails.packageObjectId = settings.package_id;
  defaultDetails.module = settings.module_name;
};

export const currentSettings = () => settings;

export const formatTransaction = (tx) => {
  const response = {};
  if (tx.EffectsCert) {
    response.effects = tx.EffectsCert.effects.effects;
    response.certificate = tx.EffectsCert.certificate;
    response.status = tx.EffectsCert.effects.effects.status.status;
  } else {
    response.effects = tx.effects;
    response.certificate = tx.certificate;
    response.status = tx.effects.status.status;
  }
  return response;
};

export const getTxObjects = async (txResults) => {
  if (txResults.effects.created) {
    const created = txResults.effects.created.map(
      (item) => item.reference.objectId
    );
    const createdInfo = await getObjectsInfo(created);
    let packageObjectId = false;
    let createdObjects = [];

    createdInfo.forEach((item) => {
      if (item.data?.dataType === "package") {
        packageObjectId = item.reference.objectId;
      } else {
        createdObjects.push(item);
      }
    });
    return [packageObjectId, createdObjects];
  }
  return [null, null];
};

const collectionType = (collection) =>
  `${collection.object_id}::${collection.module_name}::${collection.nft_name}`;

export const getNFTsInfo = async (nfts) => {
  const promises = [];
  nfts.forEach((nft) =>
    promises.push(getNFTInfo(nft, settings.nft_package_id.replace("0x0", "0x")))
  );
  const superset = await Promise.all(promises).catch((e) => console.log(e));

  return superset;
};

export const getNFTInfo = async (nft, package_id) => {
  const realId = nft.id || nft;
  //if (nft.id && !isStandardized(nft.type))  {
  // Handle nonstandard nfts with the data in the object
  const nonstandardNFT = await getObjectInfo(realId);
  if (nonstandardNFT?.data?.url) {
    nonstandardNFT.data.url = ipfsConvert(nonstandardNFT.data.url);
  }
  return nonstandardNFT;
  // }
  // const nft_package_id = package_id.replace("0x0", "0x");
  // const children = await getObjectsOwnedByObject(realId);
  // const displayData = await getObjectsInfo(
  //   children.filter((a) => a.type.includes("::display::")).map((a) => a.objectId)
  // );
  // let combined = {};
  // displayData.forEach((display) => {
  //   switch (display.type) {
  //     case `${nft_package_id}::display::DisplayDomain`:
  //       combined.name = display.data.name;
  //       combined.description = display.data.description;
  //       break;
  //     case `${nft_package_id}::display::UrlDomain`:
  //       combined.url = ipfsConvert(display.data.url);
  //       break;
  //     case `${nft_package_id}::display::AttributesDomain`:
  //       combined.attributes = {};
  //       display.data.map?.fields?.contents?.forEach((attribute) => {
  //         combined.attributes[attribute.fields.key] = attribute.fields.value;
  //       });
  //       break;
  //     default:
  //       if (display.type.includes(`${nft_package_id}::display::`)) {
  //         const shortType = display.type.replace(`${nft_package_id}::display::`, "");
  //         combined[shortType] = display.data;
  //       } else {
  //         combined[display.type] = display.data;
  //       }
  //       break;
  //   }
  // });
  // return { id: realId, type: nft.type, data: combined };
};

const promiseTransact = async (signer, fineDetails, kind = "moveCall") => {
  const originalDetals = JSON.parse(JSON.stringify(fineDetails));
  const signableTransaction = {
    kind,
    data: { ...defaultDetails, ...fineDetails },
  };
  const estimatePayment = await getLargestCoin(
    gasObjects,
    signableTransaction.data.arguments
  );
  if (kind === "publish") {
    var binary_string = window.atob(
      signableTransaction.data.compiledModules[0]
    );
    var len = binary_string.length;
    var bytes = [];
    for (var i = 0; i < len; i++) {
      bytes.push(binary_string.charCodeAt(i).toString());
    }
    signableTransaction.data.compiledModules[0] = bytes;
  }
  const gasPrice = await provider.getReferenceGasPrice();
  const gasBalance = parseInt(
    gasObjects.find((a) => a.id === estimatePayment)?.data.balance
  );
  let gasBudget = Math.min(
    Math.floor(gasBalance / gasPrice),
    parseInt(1000000 / gasPrice)
  );
  signableTransaction.data.gasPayment = estimatePayment;
  signableTransaction.data.gasBudget = gasBudget;
  try {
    const serialized = await serializer.serializeToBytes(
      userAddress,
      signableTransaction
    );
    const costInfo = await dryRunTransaction(serialized.toString());
    let totalGas = 0;
    Object.values(costInfo.gasUsed).forEach(
      (e) => (totalGas = totalGas + parseInt(e))
    );
    // Yes, you just have to do this because the gasEstimate just lies.
    //gasBudget = totalGas * 2;
    //gasBudget = Math.min(gasBudget, parseInt(1000000 / gasPrice));
  } catch (e) {
    console.log(e);
  }
  if (kind === "publish") {
    signableTransaction.data.compiledModules[0] =
      originalDetals.compiledModules[0];
  }
  // signableTransaction.data.gasBudget = parseInt(gasBudget / gasPrice); // parseInt(gasBalance / gasPrice);
  signableTransaction.data.gasPayment =
    getPaymentCoin(
      gasBudget * gasPrice,
      gasObjects,
      signableTransaction.data.arguments
    ) || estimatePayment;

  return new Promise(async (resolve, reject) => {
    try {
      let tx = await ethos.transact({
        signer,
        signableTransaction,
      });
      if (tx?.effects?.status?.status === "success") {
        resolve(formatTransaction(tx));
      } else {
        if (tx?.effects?.status?.error) {
          reject(tx?.effects?.status?.error);
        } else {
          reject(tx);
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export const showWallet = () => ethos.showWallet();

export const loginSignature = () =>
  new Promise((resolve, reject) => {
    const signData = `Onyx.io::login::${Date.now()}`;
    ethos
      .sign({
        signer,
        messsage: signData,
      })
      .then((res) => {
        ethos.hideWallet();
        resolve(res);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });

export const asValidObjectID = (value) => {
  const prepend = "0x";
  let retval = value.replace(/[^A-Za-z0-9]/g, "");
  if (retval.length < 2) {
    return retval;
  }
  if (retval.startsWith(prepend)) {
    retval = retval.substring(2);
  }
  return padHex(retval.replace(/[^A-Fa-f0-9]/g, ""));
};

export const padType = (type) => {
  const types = type.split("::");
  return asValidObjectID(types[0]) + "::" + types[1] + "::" + types[2];
};

export const isValidObjectId = (value) => isValidSuiObjectId(value);

export const setProvider = (newProvider, newSigner, newAddress) => {
  if (newProvider) {
    // provider = newProvider;
    // serializer = new LocalTxnDataSerializer(newProvider);
  }
  signer = newSigner;
  userAddress = newAddress;
};

export const disconnect = () => {
  ethos.disconnect(true);
  userAddress = false;
};

const getUserObjects = (address) =>
  provider.getObjectsOwnedByAddress(address || userAddress);

export const getObjectsOwnedByObject = (objectId) =>
  provider.getDynamicFields(objectId).then((a) => a.data);

export const devInspectTransaction = (address, tx) =>
  provider.devInspectTransaction(address || userAddress, tx);

export const dryRunTransaction = (txBytes) =>
  provider.dryRunTransaction(txBytes);

export const getObjectInfo = (objectId) =>
  provider.getObject(objectId).then((a) => formatSuiItem(a));

export const getObjectsInfo = async (objectIds) => {
  let fullContents = [];
  try {
    fullContents = await provider
      .getObjectBatch(objectIds)
      .then((info) => info.map((a) => formatSuiItem(a)));
  } catch (e) {
    for (const id of objectIds) {
      const contents = await getObjectInfo(id);
      fullContents.push(contents);
    }
  }
  return fullContents;
};

export const getTransaction = (txhash) => provider.getTransaction(txhash);

export const getEvents = (query, cursor, limit, order) =>
  provider.getEvents(query, cursor, limit, order);
/*
    | "All"
    | { "Transaction": TransactionDigest }
    | { "MoveModule": { package: ObjectId, module: string } }
    | { "MoveEvent": string }
    | { "EventType": EventType }
    | { "Sender": SuiAddress }
    | { "Recipient": ObjectOwner }
    | { "Object": ObjectId }
    | { "TimeRange": { "start_time": number, "end_time": number } };
*/

export const getUserCoins = async (type = SUI) => {
  const userObjects = await getUserObjects();
  let largest = 0;
  const items = [];
  userObjects.forEach((item) => {
    if (item.type == `0x2::coin::Coin<${type}>`) {
      items.push(item.objectId);
    }
  });
  let suiObjects = (await getObjectsInfo(items)).filter((a) => a);
  let total = 0;
  suiObjects = suiObjects.map(({ id, data: { balance } }) => {
    const intBalance = parseInt(balance);
    total += intBalance;
    if (intBalance > largest) {
      largest = intBalance;
    }
    return {
      id,
      data: {
        balance: intBalance,
      },
    };
  });
  return {
    total,
    largest,
    suiObjects,
  };
};

const generateSkipIds = (args) => {
  const skipObjectIds = [];
  args.forEach((a) => {
    if (typeof a === "string" && isValidSuiObjectId(a)) {
      skipObjectIds.push(a);
    } else if (Array.isArray(a)) {
      a.forEach((b) => {
        if (typeof b === "string" && isValidSuiObjectId(b)) {
          skipObjectIds.push(b);
        }
      });
    }
  });
  return skipObjectIds;
};

export const getPaymentCoin = (amount, suiObjects, args = []) => {
  let diff = Number.MAX_SAFE_INTEGER;
  let coinObject = false;
  const skipList = generateSkipIds(args);
  suiObjects.forEach(({ id, data }) => {
    if (skipList.includes(id)) {
      return;
    }
    const amnt = parseInt(data.balance);
    const thisDiff = amnt - amount;
    if (thisDiff >= 0 && thisDiff < diff) {
      coinObject = id;
      diff = thisDiff;
    }
  });
  return coinObject;
};

export const getLargestCoin = async (suiObjects, args = []) => {
  let max = 0;
  let coinObject = false;
  const skipObjectIds = generateSkipIds(args);

  suiObjects.forEach(({ id, data }) => {
    if (skipObjectIds.includes(id)) {
      return;
    }
    const amnt = parseInt(data.balance);
    if (max < amnt) {
      max = amnt;
      coinObject = id;
    }
  });
  return coinObject;
};

export const getObjectsByType = async (
  types,
  from = false,
  notTypes,
  verifyOwnership = false
) => {
  const userObjects = from ? from : await getUserObjects();
  const items = userObjects.filter((item) =>
    filter(item.type, types, notTypes)
  );
  if (items) {
    const suiObjects = await getObjectsInfo(items.map((a) => a.objectId)).then(
      (res) => res.filter((a) => a)
    );
    if (verifyOwnership) {
      return suiObjects.filter((a) => a.owner === userAddress) || false;
    }
    return suiObjects;
  }
  return false;
};

export const mergeCoins = async (coins) =>
  promiseTransact(signer, {
    packageObjectId: "0x02",
    module: "coin",
    function: "join",
    typeArguments: [SUI],
    arguments: coins,
  });

export const makeNftListing = async (nft, price) =>
  promiseTransact(signer, {
    function: "list",
    typeArguments: [nft.type],
    arguments: [settings.market_address, nft.id, suiToMyst(price).toString()],
  });

export const buyNftListing = async (listing, price) => {
  const { suiObjects } = await getUserCoins(listing.sale_token);
  const coin = getPaymentCoin(price, suiObjects);
  if (isStandardized(listing.object_type)) {
    return promiseTransact(signer, {
      function: "buy_standard_and_take",
      typeArguments: [getInternalType(listing.object_type)],
      arguments: [
        settings.market_address,
        listing.listing_object_id,
        coin,
        settings.allowlist,
      ],
    });
  } else {
    return promiseTransact(signer, {
      function: "buy_and_take",
      typeArguments: [listing.object_type],
      arguments: [settings.market_address, listing.listing_object_id, coin],
    });
  }
};

export const makeNftAuction = async (
  nft,
  { price, min_bid_increment, starts, expires }
) => {
  const truePrice = suiToMyst(price);
  let formattedStarts = (new Date(starts).getTime() / 1000).toString();
  let formattedExpires = (new Date(expires).getTime() / 1000).toString();
  const { suiObjects } = await getUserCoins();
  const collateral = getPaymentCoin(settings.collateralFee, suiObjects);
  if (!collateral) {
    throw new Error("Could not find a coin for insurance");
  }
  return promiseTransact(signer, {
    function: "auction",
    typeArguments: [nft.type],
    arguments: [
      settings.market_address,
      nft.id,
      truePrice.toString(),
      suiToMyst(min_bid_increment).toString(), // min_bid_increment
      formattedStarts,
      formattedExpires,
      collateral,
    ],
  });
};

export const bidNFTAuction = async (auction, price) => {
  const truePrice = suiToMyst(price);
  const { suiObjects } = await getUserCoins(auction.sale_token);
  const coin = getPaymentCoin(truePrice, suiObjects);
  return promiseTransact(signer, {
    function: "bid",
    typeArguments: [auction.object_type],
    arguments: [
      settings.market_address,
      auction.listing_object_id,
      coin,
      truePrice.toString(),
    ],
  });
};

export const winNFTAuction = async (listing) => {
  if (isStandardized(listing.object_type)) {
    return promiseTransact(signer, {
      function: "complete_auction_and_take_standard",
      typeArguments: [getInternalType(listing.object_type)],
      arguments: [
        settings.market_address,
        listing.listing_object_id,
        settings.allowlist,
      ],
    });
  } else {
    return promiseTransact(signer, {
      function: "complete_auction_and_take",
      typeArguments: [listing.object_type],
      arguments: [settings.market_address, listing.listing_object_id],
    });
  }
};

export const unlistNFT = async (listing) => {
  if (listing.sale_type === "auction") {
    return promiseTransact(signer, {
      function: "deauction_and_take",
      typeArguments: [listing.object_type],
      arguments: [settings.market_address, listing.listing_object_id],
    });
  } else {
    return promiseTransact(signer, {
      function: "delist_and_take",
      typeArguments: [listing.object_type],
      arguments: [settings.market_address, listing.listing_object_id],
    });
  }
};

export const mintNFT = async (
  {
    name,
    description,
    image,
    nft_colection,
    tier,
    metadata,
    recipient,
    count,
    launchpad,
    price,
    min_bid_increment,
    starts,
    expires,
  },
  type
) => {
  let real_price = suiToMyst(price);
  let real_min_bid_incremet = suiToMyst(min_bid_increment);
  const attribute_keys = metadata ? Object.keys(metadata) : [];
  const attribute_values = metadata
    ? Object.keys(metadata).map((key) => metadata[key].toString())
    : [];
  const args = [
    name,
    description,
    image,
    attribute_keys,
    attribute_values,
    nft_colection.mint_object_id,
  ];

  let functionName = "mint_to";
  switch (type) {
    case "list":
      functionName = "mint_and_list";
      args.push(settings.allowlist);
      args.push(count.toString());
      args.push(settings.market_address);
      args.push(real_price.toString());
      break;
    case "auction":
      functionName = "mint_and_auction";
      args.push(settings.allowlist);
      args.push(settings.market_address);
      args.push(real_price.toString());
      args.push((new Date(starts).getTime() / 1000).toString());
      args.push((new Date(expires).getTime() / 1000).toString());
      const { suiObjects } = await getUserCoins();
      const collateral = getPaymentCoin(real_min_bid_incremet, suiObjects);
      args.push(collateral);
      args.push(real_min_bid_incremet?.toString() || "1000");
      break;
    case "launchpad":
      functionName = "mint_launchpad";
      args.push(launchpad.object_id);
      args.push(launchpad.sales[tier].object_id);
      args.push(count.toString());
      break;
    default:
      args.push(recipient || userAddress);
      args.push(settings.allowlist);
      args.push(count.toString());
      break;
  }
  return promiseTransact(signer, {
    packageObjectId: nft_colection.object_id,
    module: "Onyx_nft",
    function: functionName,
    arguments: args,
  });
};

export const transferNFT = async (nft, to) =>
  promiseTransact(signer, {
    module: "transfer",
    function: "transfer",
    typeArguments: [nft.type],
    arguments: [nft, to],
  });

// For Collection creation
export const publish = (data = false) => {
  return promiseTransact(
    signer,
    {
      compiledModules: data ? [data] : [settings.nft_bytes],
      gasBudget: 10000,
      packageObjectId: null,
      typeArguments: null,
      module: null,
    },
    "publish"
  );
};

export const createCollection = async (
  packageObjectId,
  carrier,
  name,
  desc,
  symbol,
  tags = [],
  fee = "500",
  max_supply = "18446744073709551615"
) =>
  promiseTransact(signer, {
    packageObjectId,
    module: "Onyx_nft",
    function: "create",
    arguments: [
      name,
      desc,
      symbol,
      userAddress, // royalty_receiver: address
      tags,
      fee.toString(),
      max_supply,
      carrier,
    ],
  });

export const addToAllowList = async (packageObjectId, collectionControlCap) =>
  promiseTransact(signer, {
    function: "add_to_allowlist",
    arguments: [settings.allowlist, collectionControlCap],
    typeArguments: [`${packageObjectId}::Onyx_nft::Onyx`],
  });

/**
 * Launchpad functions
 */
export const createLaunchpad = async (collection, prices, allowlists, limits) =>
  promiseTransact(signer, {
    packageObjectId: collection.object_id,
    module: collection.module_name,
    function: "create_launchpad",
    arguments: [collection.mint_object_id, prices, allowlists, limits],
  });

export const addLaunchpadTier = async (
  collection,
  launchpad,
  prices,
  allowlists,
  limits
) => {
  const args = {
    packageObjectId: settings.nft_package_id,
    module: "limited_fixed_price",
    function: "add_launchpad_tier",
    arguments: [
      launchpad.object_id,
      collection.mint_object_id,
      prices.map((price) => suiToMyst(price).toString()),
      allowlists,
      limits,
    ],
    typeArguments: [`0x02::sui::SUI`],
  };

  return promiseTransact(signer, args);
};

export const updateLaunchPadStatus = async (launchpad, index, start) => {
  const args = {};
  const sale = launchpad.sales[index];
  // TODO: buy_whitelisted_nft_certificate, create_bid_whitelisted
  args.packageObjectId = launchpad.launchpad_collection.object_id;
  args.module = "Onyx_nft";
  args.function = "set_live";
  args.arguments = [launchpad.object_id, sale.venue_id, start];
  return promiseTransact(signer, args);
};

export const updateLaunchpadSale = async (launchpad, saleIndex, price) => {
  const sale = launchpad.sales[saleIndex];
  const args = {
    packageObjectId: settings.nft_package_id,
    module: "limited_fixed_price",
    function: "set_price",
    arguments: [
      launchpad.object_id,
      sale.venue_id,
      suiToMyst(price).toString(),
    ],
    typeArguments: [`0x02::sui::SUI`],
  };

  return promiseTransact(signer, args);
};

export const updateLaunchpadLimit = async (launchpad, saleIndex, limit) => {
  const sale = launchpad.sales[saleIndex];
  const args = {
    packageObjectId: settings.nft_package_id,
    module: "limited_fixed_price",
    function: "set_limit",
    arguments: [launchpad.object_id, sale.venue_id, limit.toString()],
    typeArguments: [`0x02::sui::SUI`],
  };

  return promiseTransact(signer, args);
};

export const getLaunchpadUserLimit = async (launchpad, saleIndex) => {
  const signableTransaction = {
    kind: "moveCall",
    data: {
      packageObjectId: settings.nft_package_id,
      module: "limited_fixed_price",
      function: "borrow_count",
      arguments: [launchpad.sales[saleIndex].market_id, userAddress],
      typeArguments: [`0x02::sui::SUI`],
    },
  };
  return provider.devInspectTransaction(userAddress, signableTransaction);
};

export const buyLaunchpadNFT = async (
  launchpad,
  saleIndex,
  whitelist_token = false,
  quantity = 1
) => {
  const args = {};
  const col = launchpad.launchpad_collection;
  const listing = launchpad.object_id;
  const { venue_id } = launchpad.sales[saleIndex];
  const price = launchpad.sales[saleIndex].price.toString();
  const { suiObjects } = await getUserCoins(SUI);
  const coin = getPaymentCoin(price, suiObjects);

  args.packageObjectId = settings.nft_package_id;
  args.module = launchpad.auction ? "dutch_auction" : "limited_fixed_price";
  if (whitelist_token) {
    args.function = launchpad.auction
      ? "create_bid_whitelisted"
      : "buy_whitelisted_nft";
  } else {
    args.function = launchpad.auction ? "create_bid" : "buy_nft";
  }
  if (launchpad.auction) {
    args.arguments = whitelist_token
      ? [coin, listing, venue_id, whitelist_token, price, quantity]
      : [coin, listing, venue_id, price, quantity];
  } else {
    args.arguments = whitelist_token
      ? [listing, venue_id, coin, whitelist_token]
      : [listing, venue_id, coin];
  }
  args.typeArguments = [
    `${col.object_id}::${col.module_name}::${col.nft_name}`,
    SUI,
  ];
  return promiseTransact(signer, args);
};

export const claimLaunchpadNFT = async (launchpad, certificate, to) => {
  const args = {};
  const col = launchpad.collection;
  const sling = launchpad.object_id;
  const certInfo = await getObjectInfo(certificate);

  args.packageObjectId = launchpad.package_id || settings.package_id;
  args.module = launchpad.auction ? "dutch_auction" : "limited_fixed_price";
  args.function = launchpad.loose ? "claim_nft_loose" : "claim_nft_embedded";
  args.arguments = [sling, certInfo.data.nft_id, certificate, to];
  args.typeArguments = [
    `${col.object_id}::${col.module_name}::${col.nft_name}`,
    launchpad.market,
    `${settings.nft_package_id}::nft_protocol::StdMeta`,
  ];
  return promiseTransact(signer, args);
};

// Safes
export const newSafe = async () => {
  const args = {
    packageObjectId: settings.nft_package_id,
    module: "safe",
    function: "create_for_sender",
    arguments: [],
    typeArguments: [],
  };
  return promiseTransact(signer, args);
};

// Lending
export const lendNFT = async (
  nft,
  safe,
  { price, start_date, end_date, min_duration, max_duration }
) => {
  // TODO: check if safe accepts type so we can send it back. assert_can_deposit<T>(safe)
  let formattedStarts = (new Date(start_date).getTime() / 1000).toString();
  let formattedEnds = (new Date(end_date).getTime() / 1000).toString();
  const args = {
    module: "lending",
    arguments: [
      nft.id,
      safe.safe,
      settings.lending[0].marketplace,
      settings.lending[0].safe,
      suiToMyst(price).toString(),
      min_duration.toString(),
      max_duration.toString(),
      formattedStarts,
      formattedEnds,
    ],
    typeArguments: [nft.type],
  };

  let in_safe = nft.owner !== userAddress;
  if (in_safe) {
    args.arguments = args.arguments.concat([safe.cap]);
  }

  if (isStandardized(nft.type)) {
    args.function = in_safe ? "lend" : "lend_outside_safe";
    if (in_safe) {
      args.arguments = args.arguments.concat([settings.allowlist]);
    }
    args.typeArguments = [getInternalType(nft.type)];
  } else {
    args.function = in_safe ? "lend_generic" : "lend_generic_outside_safe";
  }
  return promiseTransact(signer, args);
};

export const borrowNFT = async (listing, type, hours, safe) => {
  let price = parseInt((listing.ask_per_day * hours) / 24);
  let coin = getPaymentCoin(price, gasObjects);
  const args = {
    module: "lending",
    function: "borrow_generic",
    typeArguments: [collectionType(listing.nft_collection)],
    arguments: [
      listing.nft_object_id,
      hours.toString(),
      coin,
      safe.safe,
      safe.cap,
      settings.lending[0].marketplace,
      settings.lending[0].safe,
    ],
  };
  if (isStandardized(type)) {
    args.function = "borrow";
    args.arguments.push(settings.allowlist);
  }

  return promiseTransact(signer, args);
};

export const returnNFT = async (listing) => {
  let nft = await getObjectInfo(listing.nft_object_id);
  const args = {
    module: "lending",
    function: "relinquish_generic",
    typeArguments: [collectionType(listing.nft_collection)],
    arguments: [
      listing.nft_object_id,
      listing.borrower.primary_safe.safe,
      settings.lending[0].marketplace,
      settings.lending[0].safe,
    ],
  };
  if (isStandardized(nft.type)) {
    args.function = "relinquish";
    args.arguments.push(settings.allowlist);
  }

  return promiseTransact(signer, args);
};
