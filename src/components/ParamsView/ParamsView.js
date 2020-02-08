import React from "react";
import { Collapse, Icon, Row } from "antd";
import { useSelector } from "react-redux";

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
          header="Parameters included in the autonomous agent"
          key="1"
          style={customPanelStyle}
        >
          {oracle && (
            <p>
              <b>Oracle:</b> {oracle}
            </p>
          )}
          {max_loan_value_in_underlying && (
            <p>
              <b>Max loan value in underlying:</b>{" "}
              {max_loan_value_in_underlying}
            </p>
          )}
          {feed_name && (
            <p>
              <b>Feed name:</b> {feed_name}
            </p>
          )}
          {ma_feed_name && (
            <p>
              <b>Moving average feed name:</b> {ma_feed_name}
            </p>
          )}
          {auction_period && (
            <p>
              <b>Auction period:</b> {auction_period}
            </p>
          )}
          {decimals && (
            <p>
              <b>Decimals:</b> {decimals}
            </p>
          )}
          {overcollateralization_ratio && (
            <p>
              <b>Overcollateralization ratio:</b> {overcollateralization_ratio}
            </p>
          )}
          {liquidation_ratio && (
            <p>
              <b>Liquidation ratio:</b> {liquidation_ratio}
            </p>
          )}
          {expiry_date && (
            <p>
              <b>Expiry date:</b> {expiry_date}
            </p>
          )}
        </Panel>
      </Collapse>
    </Row>
  );
};
