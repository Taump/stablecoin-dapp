import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Button, Row, Statistic, Col, Empty } from "antd";
import { useTranslation } from "react-i18next";

import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { ParamsView } from "../../components/ParamsView/ParamsView";
import moment from "moment";
import base64url from "base64url";
import config from "../../config";
import { PlaceBidModal } from "../../modals/PlaceBidModal";
import { endCoinAuction } from "../../store/actions/auction";
import { useWindowSize } from "../../hooks/useWindowSize";
import i18n from "../../i18n";
const { Countdown } = Statistic;

const byteToGb = bytes => {
  const byte = Number(bytes);
  return Number(byte / 10 ** 9);
};

export const AuctionPage = props => {
  const { t } = useTranslation("", { i18n });
  const coins = useSelector(state => state.auction.coins);
  const active = useSelector(state => state.aa.active);
  const { liquidation_ratio } = useSelector(state => state.aa.activeParams);
  const [activeBidInfo, setActiveBidInfo] = useState(null);
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const coinsAtAuction = [];

  for (let id in coins) {
    coinsAtAuction.push({ id, ...coins[id] });
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
      {coinsAtAuction.map((coin, i) => {
        const winner_bid = Number(coin.winner_bid);
        const auction_end_ts = Number(coin.auction_end_ts);
        const collateral = Number(coin.collateral);
        const opening_collateral = Number(coin.opening_collateral);
        const min_bid = opening_collateral - collateral;
        let statusIcon;
        if (coin.status === "open") {
          statusIcon = "history";
        } else if (coin.status === "active") {
          statusIcon = "hourglass";
        } else if (coin.status === "end") {
          statusIcon = "check-circle";
        }
        const data = JSON.stringify({ end_auction: 1, id: coin.id });
        const dataBase64 = base64url(data);
        const profit = winner_bid
          ? Math.min(opening_collateral, collateral + winner_bid) -
            (winner_bid + winner_bid * 0.01)
          : Math.min(opening_collateral, collateral + min_bid) - min_bid;
        const profitValue = byteToGb(profit);
        const winner_bidValue = byteToGb(winner_bid);
        const min_bidValue = byteToGb(min_bid);
        const isEnded = coin.status === "end";
        return (
          <Row
            style={{
              paddingBottom: 15,
              paddingTop: 15,
              borderBottom:
                i !== coinsAtAuction.length - 1 ? "1px solid #ddd" : "none"
            }}
            type={width >= 1200 ? "flex" : undefined}
            align="middle"
            gutter={30}
            key={"auction-card-" + i}
          >
            <Col style={width < 1200 && { display: "none" }}>
              <Icon type={statusIcon} style={{ fontSize: 48, color: "#08c" }} />
            </Col>
            <Col
              xl={{ span: 6 }}
              md={{ span: 8 }}
              sm={{ span: 12 }}
              style={{
                marginTop: width < 576 ? 20 : 0
              }}
            >
              {auction_end_ts ? (
                <Countdown
                  title={t("pages.auction.fields.time")}
                  value={moment.unix(auction_end_ts).utc(false)}
                  onFinish={() => dispatch(endCoinAuction(coin.id))}
                />
              ) : (
                <Statistic title={t("pages.auction.fields.time")} value={"—"} />
              )}
            </Col>
            <Col
              xl={{ span: 6 }}
              md={{ span: 8 }}
              sm={{ span: 12 }}
              style={{
                marginTop: width < 576 ? 20 : 0
              }}
            >
              {winner_bid ? (
                <Statistic
                  title={t("pages.auction.fields.total")}
                  value={Number(winner_bidValue + 0.00001).toFixed(9)}
                  suffix={"GB"}
                  groupSeparator=" "
                />
              ) : (
                <Statistic
                  title={t("pages.auction.fields.min")}
                  value={Number(min_bidValue + 0.00001).toFixed(9)}
                  suffix={"GB"}
                  groupSeparator=" "
                />
              )}
            </Col>
            <Col
              xl={{ span: 5 }}
              md={{ span: 8 }}
              sm={{ span: 12 }}
              style={{
                marginTop: width < 576 ? 20 : 0
              }}
            >
              {!isEnded ? (
                <Statistic
                  title={t("pages.auction.fields.profit")}
                  prefix="~"
                  value={Number(profitValue).toFixed(9)}
                  suffix={"GB"}
                  groupSeparator=" "
                />
              ) : (
                <Statistic
                  title={t("pages.auction.fields.profit")}
                  value={"—"}
                />
              )}
            </Col>
            <Col
              sm={{ span: width < 768 ? 12 : undefined }}
              style={{
                marginTop: width < 576 ? 20 : 0
              }}
            >
              {isEnded ? (
                <div
                  style={{
                    marginTop: width < 768 ? 14.5 : 0
                  }}
                >
                  <a
                    className="ant-btn ant-btn-primary"
                    style={
                      width < 1200 && width >= 768
                        ? { marginTop: 30 }
                        : undefined
                    }
                    href={`obyte${
                      config.TESTNET ? "-tn" : ""
                    }:${active}?amount=10000&base64data=${dataBase64}`}
                  >
                    {t("pages.auction.actions.end")}
                  </a>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: width < 768 ? 14.5 : 0
                  }}
                >
                  <Button
                    type="primary"
                    style={
                      width < 1200 && width >= 768
                        ? { marginTop: 30 }
                        : undefined
                    }
                    onClick={() => {
                      setActiveBidInfo({
                        min: Math.ceil(
                          winner_bid
                            ? winner_bid + winner_bid * 0.01 + 10000
                            : min_bid + 10000
                        ),
                        id: coin.id,
                        visible: true
                      });
                    }}
                  >
                    {t("pages.auction.actions.bid")}
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        );
      })}
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
