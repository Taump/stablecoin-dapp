import obyte from "obyte";
import client from "../socket";
import config from "../config";

const isAddressByBase = async address => {
  if (obyte.utils.isValidAddress(address)) {
    const definition = await client.api.getDefinition(address);
    if (definition) {
      return (
        definition[0] === "autonomous agent" &&
        definition[1].base_aa === config.base_aa
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default isAddressByBase;
