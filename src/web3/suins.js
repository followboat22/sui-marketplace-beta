import { devInspectTransaction } from "./sui";
import get from "lodash/get";
import { Buffer } from "buffer";

const REGISTRY_ADDRESS = "0xcd65ab1b51392ea9ef0ddc974a3caad6ab3ac5a0";
const PACKAGE_ADDRESS = "0x34537208b08458d650ddd9c642614a729bfd9390";

const toHexString = (byteArray) =>
  byteArray?.length > 0
    ? Array.from(byteArray, (byte) =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
      ).join("")
    : "";

const toString = (byteArray) =>
  byteArray?.length > 0
    ? new TextDecoder().decode(Buffer.from(byteArray.slice(1)).buffer)
    : "";

const toFullAddress = (trimmedAddress) =>
  trimmedAddress ? `0x${trimmedAddress.padStart(40, "0")}` : "";

const getResolver = async (key, sender) => {
  try {
    const resolverBytes = get(
      await devInspectTransaction(sender, {
        kind: "moveCall",
        data: {
          packageObjectId: PACKAGE_ADDRESS,
          module: "base_registry",
          function: "get_record_by_key",
          typeArguments: [],
          arguments: [REGISTRY_ADDRESS, key],
        },
      }),
      "results.Ok[0][1].returnValues[1][0]"
    );
    return toFullAddress(toHexString(resolverBytes));
  } catch {
    return false;
  }
};

export const getName = async (address) => {
  const resolver = await getResolver(
    `${address.slice(2)}.addr.reverse`,
    address
  );
  if (!resolver) return "";

  const name = toString(
    get(
      await devInspectTransaction(address, {
        kind: "moveCall",
        data: {
          packageObjectId: PACKAGE_ADDRESS,
          module: "resolver",
          function: "name",
          typeArguments: [],
          arguments: [resolver, address],
        },
      }),
      "results.Ok[0][1].returnValues[0][0]"
    )
  );
  return name;
};
