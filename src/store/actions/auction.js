import {
  ADD_BID_COIN_AUCTION,
  ADD_FOR_AUCTION,
  END_COIN_AUCTION,
  INIT_AUCTION,
  REMOVE_FOR_AUCTION
} from "../types/auction";

export const initAuction = initValue => ({
  type: INIT_AUCTION,
  payload: initValue
});

export const addForAuction = coinInfo => ({
  type: ADD_FOR_AUCTION,
  payload: { ...coinInfo }
});

export const removeForAuction = id => ({
  type: REMOVE_FOR_AUCTION,
  payload: id
});

export const addBidForCoinAuction = (id, newBid, timestamp) => async (
  dispatch,
  getState
) => {
  const store = getState();
  const end_time = timestamp + store.aa.activeParams.auction_period;
  const coin = store.auction.coins[id];
  const winner_bid = Number(coin.winner_bid);
  const opening_collateral = Number(coin.opening_collateral);
  const collateral = Number(coin.collateral);
  const current_bid = winner_bid ? winner_bid : opening_collateral - collateral;
  console.log(
    "current_bid",
    current_bid,
    "newBid",
    newBid,
    "newBid >= current_bid",
    newBid >= current_bid
  );
  if (current_bid && newBid >= current_bid) {
    dispatch({
      type: ADD_BID_COIN_AUCTION,
      payload: { ...coin, id, winner_bid: newBid, auction_end_ts: end_time }
    });
  }
};

export const endCoinAuction = id => ({
  type: END_COIN_AUCTION,
  payload: id
});
