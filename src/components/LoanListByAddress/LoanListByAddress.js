import React, { useState } from "react";
import { Button, Row, Col, Empty, Modal, Input, Form } from "antd";
import base64url from "base64url";
import { useWindowSize } from "../../hooks/useWindowSize";
import config from "../../config";
import { useSelector } from "react-redux";
import { redirect, t } from "../../utils";

export const LoanListByAddress = ({ address }) => {
  const [width] = useWindowSize();
  const walletsInfo = useSelector(state => state.aa.activeCoins);
  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const activeParams = useSelector(state => state.aa.activeParams);
  const activeDataFeedMa = useSelector(state => state.aa.activeDataFeedMa);

  const initLoanCollateralState = {
    visible: false,
    id: null,
    count: undefined,
    help: "",
    status: "",
    valid: false
  };
  const [loanCollateral, setLoanCollateral] = useState(initLoanCollateralState);
  const handleClickCollateral = id => {
    setLoanCollateral({ ...loanCollateral, visible: true, id });
  };
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
  const exchange_rate = activeInfo.expired
    ? activeInfo.expiry_exchange_rate
    : activeDataFeedMa;
  if (width > 768 && list.length > 0) {
    LoanList = list.map((el, i) => {
      const min_collateral = (el.amount / 100 / exchange_rate) * 1000000000;
      const min_collateral_liquidation = Math.ceil(
        min_collateral * activeParams.liquidation_ratio
      );
      const amountPercent = Math.ceil((el.collateral / min_collateral) * 100);
      const disabledRepayment = el.collateral < min_collateral_liquidation;
      const color = disabledRepayment ? { color: "red" } : { color: "green" };
      return (
        <Row
          key={"loan-" + i}
          type="flex"
          align="middle"
          style={{
            padding: 10,
            color: "#000",
            borderBottom: "1px solid #ddd",
            ...color
          }}
        >
          <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 0 }}>
            {el.amount}
          </Col>
          <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
            {el.collateral} ({amountPercent}%)
          </Col>
          <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 1 }}>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => handleClickCollateral(el.id)}
            >
              Add collateral
            </Button>
            <Button
              onClick={() => handleClickRepayment(el.id, el.amount)}
              disabled={disabledRepayment}
            >
              Repayment
            </Button>
          </Col>
        </Row>
      );
    });
  } else if (list.length > 0) {
    LoanList = list.map((el, i) => {
      const min_collateral = (el.amount / 100 / exchange_rate) * 1000000000;
      const min_collateral_liquidation = Math.ceil(
        min_collateral * activeParams.liquidation_ratio
      );
      const amountPercent = Math.ceil((el.collateral / min_collateral) * 100);
      const disabledRepayment = el.collateral < min_collateral_liquidation;
      const color = disabledRepayment ? { color: "red" } : { color: "green" };
      return (
        <div
          style={{ marginBottom: 30, marginTop: 15, ...color }}
          key={"loan-min-" + i}
        >
          <Row>Coins: {el.amount}</Row>
          <Row>
            Collateral: {el.collateral} ({amountPercent}%)
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Button
              type="primary"
              style={{ marginRight: 25 }}
              onClick={() => handleClickCollateral(el.id)}
            >
              Add collateral
            </Button>
            <Button
              onClick={() => handleClickRepayment(el.id, el.amount)}
              disabled={disabledRepayment}
            >
              Repayment
            </Button>
          </Row>
        </div>
      );
    });
  } else if (address !== "") {
    console.log("address", address);
    LoanList = (
      <Empty description="No loans" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    );
  }
  const addCollateral = ev => {
    if (ev) {
      ev.preventDefault();
    }
    const data = JSON.stringify({ add_collateral: 1, id: loanCollateral.id });
    const dataBase64 = base64url(data);
    redirect(
      `byteball${config.TESTNET ? "-tn" : ""}:${active}?amount=${
        loanCollateral.count
      }&base64data=${dataBase64}`
    );
    setLoanCollateral(initLoanCollateralState);
  };
  const handleClickRepayment = (id, amount) => {
    const data = JSON.stringify({ repay: 1, id });
    const dataBase64 = base64url(data);
    // redirect(
    //   `byteball${config.TESTNET ? "-tn" : ""}:${active}?amount=${
    //     loanCollateral.count
    //   }&base64data=${dataBase64}`
    // );

    if (activeInfo && "asset" in activeInfo) {
      console.log("asset", activeInfo.asset);
      redirect(
        `byteball${
          config.TESTNET ? "-tn" : ""
        }:${active}?amount=${amount}&asset=${encodeURIComponent(
          activeInfo.asset
        )}&base64data=${dataBase64}`
      );
    }
  };
  const handleChangeCollateralCount = ev => {
    const value = ev.target.value || "";
    const reg = /^[0-9]+$/g;
    if (value) {
      if (reg.test(value)) {
        if (Number(value) <= 10000000000000000) {
          if (Number(value) >= 100000) {
            setLoanCollateral({
              ...loanCollateral,
              count: value,
              help: "",
              status: "success",
              valid: true
            });
          } else {
            setLoanCollateral({
              ...loanCollateral,
              count: value,
              help: t("forms.error.minNum", { count: "100 000" }),
              status: "error",
              valid: false
            });
          }
        } else {
          setLoanCollateral({
            ...loanCollateral,
            count: value,
            help: t("forms.error.muchValue"),
            status: "error",
            valid: false
          });
        }
      }
    } else {
      setLoanCollateral({
        ...loanCollateral,
        count: undefined,
        help: "",
        status: "",
        valid: false
      });
    }
  };

  return (
    <div>
      <Modal
        visible={loanCollateral.visible}
        onCancel={() => setLoanCollateral(initLoanCollateralState)}
        title="Add collateral"
        footer={[
          <Button
            key="cancel"
            onClick={() => setLoanCollateral(initLoanCollateralState)}
          >
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={addCollateral}
            disabled={!loanCollateral.valid}
          >
            Add
          </Button>
        ]}
      >
        <Form onSubmit={addCollateral}>
          <Form.Item
            hasFeedback
            validateStatus={loanCollateral.status}
            help={loanCollateral.help}
          >
            <Input
              placeholder="Count byte"
              onChange={handleChangeCollateralCount}
              value={loanCollateral.count}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
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
