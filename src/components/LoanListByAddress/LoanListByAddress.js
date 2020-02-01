import React from "react";
import { Button, Row, Col, Empty } from "antd";
import base64url from "base64url";
import { truncate } from "lodash";
import { useWindowSize } from "../../hooks/useWindowSize";
import config from "../../config";
import { useSelector } from "react-redux";

export const LoanListByAddress = ({ address }) => {
  const [width] = useWindowSize();
  const walletsInfo = useSelector(state => state.aa.activeCoins);
  let list = [];
  for (const fields in walletsInfo) {
    if (walletsInfo[fields].owner === address) {
      list.push({
        id: fields,
        collateral: walletsInfo[fields].collateral,
        amount: walletsInfo[fields].amount
      });
    }
  }
  let LoanList;
  if (width > 768 && list.length > 0) {
    LoanList = list.map((el, i) => (
      <Row
        style={{ padding: 10, color: "#000", borderBottom: "1px solid #ddd" }}
        key={"loan-" + i}
        type="flex"
        align="middle"
      >
        <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 0 }}>
          {el.amount}
        </Col>
        <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
          {el.collateral} (1555%)
        </Col>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 1 }}>
          <Button type="primary" style={{ marginRight: 10 }}>
            Add collateral
          </Button>
          <Button>Repayment</Button>
        </Col>
      </Row>
    ));
  } else if (list.length > 0) {
    LoanList = list.map((el, i) => (
      <div style={{ marginBottom: 30 }} key={"loan-min-" + i}>
        <Row>Coins: {el.amount}</Row>
        <Row>Collateral: {el.collateral} (1555%)</Row>
        <Row style={{ marginTop: 10 }}>
          <Button type="primary" style={{ marginRight: 25 }}>
            Add collateral
          </Button>
          <Button>Repayment</Button>
        </Row>
      </div>
    ));
  } else if (address !== "") {
    console.log("address", address);
    LoanList = (
      <Empty description="No loans" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }

  return (
    <div>
      {LoanList && LoanList.length > 0 && width > 768 && (
        <Row style={{ padding: 10, fontWeight: "bold" }}>
          <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 0 }}>
            Count coins
          </Col>
          <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
            Collateral
          </Col>
          <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 1 }}>
            Actions
          </Col>
        </Row>
      )}
      {LoanList}
    </div>
  );
};
