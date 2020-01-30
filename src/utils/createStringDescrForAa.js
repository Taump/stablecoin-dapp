import { truncate } from "lodash";

const truncateOptions = { length: 13 };

export const createStringDescrForAa = (address, feed_name, expiry_date) => {
  const vFN = truncate(feed_name, truncateOptions);

  return `${vFN} on ${expiry_date} (${address})`;
};
