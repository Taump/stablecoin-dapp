import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Empty } from "antd";
import { useTranslation } from "react-i18next";

import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { ParamsView } from "../../components/ParamsView/ParamsView";
import base64url from "base64url";
import { PlaceBidModal } from "../../modals/PlaceBidModal";
import { useWindowSize } from "../../hooks/useWindowSize";
import i18n from "../../i18n";
import { AuctionFull } from "./view/AuctionFull";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AuctionMob } from "./view/AuctionMob";

export const AuctionPage = props => {
  const { t } = useTranslation("", { i18n });
  const coins = useSelector(state => state.auction.coins);
  const active = useSelector(state => state.aa.active);
  const exchange_rate = useSelector(state => state.aa.activeDataFeedMa);
  const { liquidation_ratio, decimals } = useSelector(
    state => state.aa.activeParams
  );
  const [activeBidInfo, setActiveBidInfo] = useState(null);
  const [wallets] = useLocalStorage("scWallets");
  const [width] = useWindowSize();
  const coinsAtAuction = [];
  if (exchange_rate) {
    for (let id in coins) {
      const opening_collateral = Number(coins[id].opening_collateral);
      const winner_bid = Number(coins[id].winner_bid);
      const collateral = Number(coins[id].collateral);
      const min_bid = opening_collateral - collateral;
      const amount = Number(coins[id].amount);
      const isYour = wallets
        ? wallets.filter(wallet => wallet === coins[id].owner).length > 0
        : false;
      const min_collateral =
        (amount / Math.pow(10, decimals) / exchange_rate) * 1000000000;
      const percent = Math.ceil((collateral / min_collateral) * 100);
      const current_bid = winner_bid ? winner_bid : min_bid;
      const bid = (winner_bid ? winner_bid * 1.01 : min_bid) + 1000;
      const profit =
        Math.min(opening_collateral, collateral + bid) -
        bid -
        Math.ceil(((1e9 / exchange_rate) * amount) / 10 ** decimals);
      const data = JSON.stringify({ end_auction: 1, id });
      const dataBase64 = base64url(data);
      coinsAtAuction.push({
        id,
        ...coins[id],
        profit,
        percent,
        bid,
        amount,
        dataBase64,
        current_bid,
        setActiveBidInfo,
        isYour
      });
    }
  }

  return (
    <Layout title={t("pages.auction.title")} page="auction">
      {!isNaN(Number(liquidation_ratio)) && (
        <Row style={{ fontSize: 18, marginBottom: 25 }}>
          <Col xs={{ span: 24 }} lg={{ span: 16 }} xl={{ span: 12 }}>
            This is the list of loans whose collateralization ratio dropped
            below minimum ({Number(liquidation_ratio) * 100}%) and they are put
            on auction. The winner of an action becomes the new owner of the
            loan being auctioned and has an opportunity to pay for it less than
            its collateral value.
          </Col>
        </Row>
      )}
      <Row>
        <SelectAA autoFocus={true} />
        {active && <ParamsView />}
      </Row>
      {active && width >= 1440 && coinsAtAuction.length > 0 && (
        <AuctionFull data={coinsAtAuction} />
      )}
      {active && width < 1440 && coinsAtAuction.length > 0 && (
        <AuctionMob data={coinsAtAuction} />
      )}
      {coinsAtAuction.length === 0 && active && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("pages.auction.empty")}
        />
      )}

      <PlaceBidModal
        min={activeBidInfo && String(activeBidInfo.min)}
        visible={activeBidInfo ? activeBidInfo.visible : false}
        id={activeBidInfo && activeBidInfo.id}
        onCancel={() => setActiveBidInfo(null)}
      />
    </Layout>
  );
};
