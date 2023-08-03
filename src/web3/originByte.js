import { currentSettings } from "./sui";

export const getInternalType = (type) => {
  try {
    return type.split("<")[1].split(">")[0];
  } catch (e) {
    return false;
  }
};

export const isStandardized = (type) => {
  let settings = currentSettings();
  return type.includes(`${settings.nft_package_id}::nft::Nft`);
};
