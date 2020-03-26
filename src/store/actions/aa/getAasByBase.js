import { LOAD_AA_LIST_REQUEST, LOAD_AA_LIST_SUCCESS } from "../../types/aa";
import client from "../../../socket";
import config from "../../../config";
import { createStringDescrForAa } from "../../../utils";

const ASSETS_LOCAL_STORAGE_NAME = "scAssets";
export const getAasByBase = () => async dispatch => {
  try {
    await dispatch({
      type: LOAD_AA_LIST_REQUEST
    });
    const aaByBase = await client.api.getAasByBaseAas({
      base_aa: config.BASE_AA
    });

    const items = window.localStorage.getItem(ASSETS_LOCAL_STORAGE_NAME);
    const assets = items ? JSON.parse(items) : [];

    const getExtendAssets = aaByBase.map(async aa => {
      const found =
        assets.filter(asset => aa.address === asset.address).length > 0;
      if (!found) {
        return client.api
          .getAaStateVars({
            address: aa.address,
            var_prefix: "asset"
          })
          .then(data => {
            if ("asset" in data) {
              return { address: aa.address, ...data };
            }
          });
      }
    });

    const extendAssets = await Promise.all(getExtendAssets).then(data => {
      return data.filter(asset => asset);
    });
    const allAssets = [...assets, ...extendAssets];
    const getSymbolByAssets = allAssets.map(async aa => {
      if (aa && "asset" in aa) {
        return await client.api
          .getSymbolByAsset(config.TOKEN_REGISTRY_AA_ADDRESS, aa.asset)
          .then(symbol => {
            if (symbol) {
              if (aa.asset.replace(/[+=]/, "").substr(0, 6) !== symbol) {
                return { address: aa.address, symbol };
              }
            }
          });
      }
    });
    const symbols = await Promise.all(getSymbolByAssets);
    if (aaByBase && aaByBase !== []) {
      aaByBase.forEach(aa => {
        const { feed_name, expiry_date } = aa.definition[1].params;
        const aaWithSymbol = symbols.filter(s => s && s.address === aa.address);
        aa.view = createStringDescrForAa(
          aa.address,
          feed_name,
          expiry_date,
          aaWithSymbol.length === 1 && aaWithSymbol[0].symbol
        );
        aa.isStable = true;
      });
    }
    if (extendAssets.filter(asset => asset).length > 0) {
      await window.localStorage.setItem(
        ASSETS_LOCAL_STORAGE_NAME,
        JSON.stringify(extendAssets.filter(asset => asset))
      );
    }

    await dispatch({
      type: LOAD_AA_LIST_SUCCESS,
      payload: aaByBase || []
    });
  } catch (e) {
    console.log("error", e);
  }
};
