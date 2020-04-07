import { LOAD_AA_LIST_REQUEST, LOAD_AA_LIST_SUCCESS } from "../../types/aa";
import client from "../../../socket";
import config from "../../../config";
import { createStringDescrForAa } from "../../../utils";
import moment from "moment";

const ASSETS_LOCAL_STORAGE_NAME = "scAssets";
const SYMBOLS_LOCAL_STORAGE_NAME = "scSymbols";
export const getAasByBase = () => async dispatch => {
  const today = moment().format("YYYY-MM-DD");
  try {
    await dispatch({
      type: LOAD_AA_LIST_REQUEST
    });
    const aaByBase = await client.api.getAasByBaseAas({
      base_aa: config.BASE_AA
    });
    console.log("aaByBase", aaByBase);
    const assetsString = window.localStorage.getItem(ASSETS_LOCAL_STORAGE_NAME);
    const assets = assetsString ? JSON.parse(assetsString) : [];
    const symbolsString = window.localStorage.getItem(
      SYMBOLS_LOCAL_STORAGE_NAME
    );
    const symbols = symbolsString ? JSON.parse(symbolsString) : [];

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
    // eslint-disable-next-line array-callback-return
    const getExtendSymbols = allAssets.map(obj => {
      const { address, asset } = obj;
      if (asset) {
        const findSymbol = symbols.filter(
          symbols => symbols.address === address
        );
        if (findSymbol.length > 0) {
          const latestUpdate = moment(findSymbol[0].latestUpdate);
          if (latestUpdate.isValid()) {
            const yesterday = moment(today).add(-1, "days");
            if (moment(latestUpdate).isSameOrBefore(yesterday)) {
              return client.api
                .getSymbolByAsset(config.TOKEN_REGISTRY_AA_ADDRESS, asset)
                .then(symbol => {
                  if (symbol) {
                    if (asset.replace(/[+=]/, "").substr(0, 6) !== symbol) {
                      return { address: address, symbol, latestUpdate: today };
                    }
                  }
                });
            }
          }
        } else {
          return client.api
            .getSymbolByAsset(config.TOKEN_REGISTRY_AA_ADDRESS, asset)
            .then(symbol => {
              if (symbol) {
                if (asset.replace(/[+=]/, "").substr(0, 6) !== symbol) {
                  return { address: address, symbol, latestUpdate: today };
                }
              }
            });
        }
      } else {
        return null;
      }
    });
    const extendSymbols = await Promise.all(getExtendSymbols).then(data => {
      return data.filter(obj => obj);
    });
    const allSymbols = [...extendSymbols, ...symbols];
    if (aaByBase && aaByBase !== []) {
      aaByBase.forEach(aa => {
        const { feed_name, expiry_date } = aa.definition[1].params;
        const aaWithSymbol = allSymbols.filter(
          s => s && s.address === aa.address
        );
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
    if (extendSymbols.filter(symbol => symbol).length > 0) {
      await window.localStorage.setItem(
        SYMBOLS_LOCAL_STORAGE_NAME,
        JSON.stringify(extendSymbols.filter(asset => asset))
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
