import { truncate } from "lodash";

const truncateOptions = { length: 13 };

const createStringDescrForAa = (
  address,
  feed_name,
  comparison,
  expiry_date,
  feed_value
) => {
  const vFN = truncate(feed_name, truncateOptions);
  const vFV = truncate(feed_value, truncateOptions);

  return `${vFN} ${comparison} ${vFV} on ${expiry_date} (${address})`;
};

export default createStringDescrForAa;
