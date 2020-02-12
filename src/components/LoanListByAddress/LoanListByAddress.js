import React, { useState } from "react";
import { Row, Col, Empty } from "antd";
import base64url from "base64url";
import { useSelector } from "react-redux";

import { CollateralAddModal } from "../../modals/CollateralAddModal";
import { LoanFullView, LoanMobView } from "./view";
import { useWindowSize } from "../../hooks/useWindowSize";
import config from "../../config";
import { redirect, t } from "../../utils";

import styles from "./LoanListByAddress.module.css";

export const LoanListByAddress = ({ address }) => {
  const [width] = useWindowSize();
  const walletsInfo = useSelector(state => state.aa.activeCoins);
  const active = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const activeParams = useSelector(state => state.aa.activeParams);
  const activeDataFeedMa = useSelector(state => state.aa.activeDataFeedMa);

  const [idCollateral, setIdCollateral] = useState(null);

  let list = [];
  for (const fields in walletsInfo) {
    const isRepaid = "repaid" in walletsInfo[fields];
    if (walletsInfo[fields].owner === address && !isRepaid) {
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

  const loanListInfo = list.map(el => {
    const min_collateral = (el.amount / 100 / exchange_rate) * 1000000000;
    const min_collateral_liquidation = Math.ceil(
      min_collateral * activeParams.liquidation_ratio
    );
    const amountPercent = Math.ceil((el.collateral / min_collateral) * 100);
    const disabledRepayment = el.collateral < min_collateral_liquidation;
    return {
      amount: el.amount,
      id: el.id,
      collateral: el.collateral,
      disabledRepayment,
      percent: amountPercent,
      color: disabledRepayment ? "red" : "green"
    };
  });

  const handleClickRepayment = (id, amount) => {
    const data = JSON.stringify({ repay: 1, id });
    const dataBase64 = base64url(data);

    if (activeInfo && "asset" in activeInfo) {
      redirect(
        `byteball${
          config.TESTNET ? "-tn" : ""
        }:${active}?amount=${amount}&asset=${encodeURIComponent(
          activeInfo.asset
        )}&base64data=${dataBase64}`
      );
    }
  };
  if (width > 768 && list.length > 0) {
    LoanList = loanListInfo.map((info, i) => (
      <LoanFullView
        {...info}
        key={"LoanFullView-" + i}
        setIdCollateral={setIdCollateral}
        handleClickRepayment={handleClickRepayment}
      />
    ));
  } else if (list.length > 0) {
    LoanList = loanListInfo.map((info, i) => (
      <LoanMobView
        {...info}
        key={"LoanFullView-" + i}
        setIdCollateral={setIdCollateral}
        handleClickRepayment={handleClickRepayment}
      />
    ));
  } else if (address !== "") {
    LoanList = (
      <Empty
        description={t("components.loanListByAddress.empty")}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      <CollateralAddModal
        visible={!!idCollateral}
        id={idCollateral}
        onCancel={() => setIdCollateral(null)}
      />
      {LoanList && LoanList.length > 0 && width > 768 && (
        <Row className={styles.mobTitle}>
          <Col xs={{ span: 10, offset: 0 }} md={{ span: 3, offset: 0 }}>
            {t("components.loanListByAddress.titles.amount")}
          </Col>
          <Col xs={{ span: 12, offset: 2 }} md={{ span: 5, offset: 1 }}>
            {t("components.loanListByAddress.titles.collateral")}
          </Col>
          <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 1 }}>
            {t("components.loanListByAddress.titles.actions")}
          </Col>
        </Row>
      )}
      {LoanList}
    </div>
  );
};
