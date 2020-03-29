import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import moment from "moment";
import { endCoinAuction } from "../../../store/actions/auction";
import config from "../../../config";
import { truncate } from "lodash";
const { Countdown } = Statistic;
export const AuctionMob = ({ data }) => {
  const { decimals } = useSelector(state => state.aa.activeParams);
  const { active } = useSelector(state => state.aa.active);
  return (
    <Row>
      {data.map(coin => (
        <Lot
          {...coin}
          decimals={decimals}
          active={active}
          key={coin.id + "-lot"}
        />
      ))}
    </Row>
  );
};

const Lot = ({
  collateral,
  auction_end_ts,
  bid,
  percent,
  profit,
  id,
  amount,
  owner,
  status,
  decimals,
  active,
  dataBase64,
  current_bid,
  setActiveBidInfo,
  winner_bid,
  isYour
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("", { i18n });
  const amountValue =
    amount && decimals && !isNaN(amount) ? amount / 10 ** Number(decimals) : 0;
  const symbol = useSelector(state => state.aa.symbol);
  return (
    <Col
      md={{ span: 12 }}
      style={{
        padding: 5,
        boxSizing: "border-box"
      }}
    >
      <div
        style={{ backgroundColor: isYour ? "#EDEDED" : "none", padding: 10 }}
      >
        <div>
          <b>Loan amount: </b>
          <span>
            {amountValue}{" "}
            {symbol ? truncate(symbol, { length: 12 }) : "stablecoins"}
          </span>
        </div>
        <div>
          <b>Owner: </b>
          <span>{owner}</span>
        </div>
        <div>
          <b>Collateral: </b>
          <span>
            {(collateral / 10 ** 9).toFixed(9)} GB{" "}
            {percent && <span>({percent}%)</span>}
          </span>
        </div>
        <div>
          <b>Time until ends: </b>
          {auction_end_ts ? (
            <Countdown
              value={moment.unix(auction_end_ts).utc()}
              onFinish={() => dispatch(endCoinAuction(id))}
              valueStyle={{ fontSize: 16 }}
            />
          ) : (
            "—"
          )}
        </div>
        <div>
          <b>{winner_bid ? "Current" : "Min"} bid: </b>
          <span>{(current_bid / 10 ** 9).toFixed(9)} GB</span>
        </div>
        <div>
          <b>Expected profit: </b>
          <span style={{ color: profit > 0 ? "green" : "red" }}>
            ~{(profit / 10 ** 9).toFixed(9)} GB
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          {status === "end" ? (
            <a
              className="ant-btn ant-btn-primary"
              href={`obyte${
                config.TESTNET ? "-tn" : ""
              }:${active}?amount=10000&base64data=${dataBase64}`}
            >
              {t("pages.auction.actions.end")}
            </a>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setActiveBidInfo({
                  min: Math.ceil(bid + 1000) / 10 ** 9,
                  id,
                  visible: true
                });
              }}
            >
              {t("pages.auction.actions.bid")}
            </Button>
          )}
        </div>
      </div>
    </Col>
  );
};
