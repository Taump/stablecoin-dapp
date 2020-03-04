import React from "react";
import { Collapse, Icon, Row } from "antd";
import { useSelector } from "react-redux";

import { t } from "../../utils";

const { Panel } = Collapse;

export const ParamsView = () => {
  const {
    overcollateralization_ratio,
    decimals,
    oracle,
    max_loan_value_in_underlying,
    auction_period,
    liquidation_ratio,
    feed_name,
    ma_feed_name,
    expiry_date
  } = useSelector(state => state.aa.activeParams);

  const customPanelStyle = {
    background: "#fff",
    borderRadius: 4,
    border: 0,
    overflow: "hidden"
  };
  return (
    <Row>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={t("components.paramsView.title")}
          key="1"
          style={customPanelStyle}
        >
          {oracle && (
            <p>
              <b>{t("components.paramsView.params.oracle")}:</b> {oracle}
            </p>
          )}
          {decimals && max_loan_value_in_underlying && (
            <p>
              <b>{t("components.paramsView.params.maxLoan")}:</b>{" "}
              {max_loan_value_in_underlying / 10 ** decimals}
            </p>
          )}
          {feed_name && (
            <p>
              <b>{t("components.paramsView.params.feedName")}:</b> {feed_name}
            </p>
          )}
          {ma_feed_name && (
            <p>
              <b>{t("components.paramsView.params.maFeedName")}:</b>{" "}
              {ma_feed_name}
            </p>
          )}
          {auction_period && (
            <p>
              <b>{t("components.paramsView.params.auctionPeriod")}:</b>{" "}
              {auction_period}
            </p>
          )}
          {decimals && (
            <p>
              <b>{t("components.paramsView.params.decimals")}:</b> {decimals}
            </p>
          )}
          {overcollateralization_ratio && (
            <p>
              <b>
                {t("components.paramsView.params.overCollateralizationRatio")}:
              </b>{" "}
              {overcollateralization_ratio}
            </p>
          )}
          {liquidation_ratio && (
            <p>
              <b>{t("components.paramsView.params.liquidationRatio")}:</b>{" "}
              {liquidation_ratio}
            </p>
          )}
          {expiry_date && (
            <p>
              <b>{t("components.paramsView.params.expiryDate")}:</b>{" "}
              {expiry_date}
            </p>
          )}
        </Panel>
      </Collapse>
    </Row>
  );
};
