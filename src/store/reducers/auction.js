import {
  ADD_BID_COIN_AUCTION,
  ADD_FOR_AUCTION,
  END_COIN_AUCTION,
  INIT_AUCTION,
  REMOVE_FOR_AUCTION
} from "../types/auction";

const initialState = {
  coins: {}
};

export const auctionReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_AUCTION: {
      return {
        ...state,
        coins: action.payload
      };
    }
    case ADD_FOR_AUCTION: {
      return {
        ...state,
        coins: { ...state.coins, ...action.payload }
      };
    }
    case REMOVE_FOR_AUCTION: {
      let newCoins = {};
      for (const key in state.coins) {
        if (key !== action.payload) {
          newCoins[key] = state.coins[key];
        }
      }
      return {
        ...state,
        coins: newCoins
      };
    }
    case ADD_BID_COIN_AUCTION: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload.id]: { ...action.payload, status: "active" }
        }
      };
    }
    case END_COIN_AUCTION: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload]: { ...state.coins[action.payload], status: "end" }
        }
      };
    }
    default:
      return state;
  }
};
