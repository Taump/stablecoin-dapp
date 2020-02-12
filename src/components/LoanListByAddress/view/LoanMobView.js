import React from "react";
import { Button, Row } from "antd";

import { t } from "../../../utils";

import styles from "./../LoanListByAddress.module.css";

export const LoanMobView = ({
  id,
  amount,
  color,
  collateral,
  percent,
  disabledRepayment,
  setIdCollateral,
  handleClickRepayment
}) => (
  <div
    className={styles.mobRow}
    style={{ color }}
    key={"loan-min-" + amount + "-" + collateral}
  >
    <Row>
      {t("components.loanListByAddress.titles.amount")}: {amount}
    </Row>
    <Row>
      {t("components.loanListByAddress.titles.collateral")}: {collateral} (
      {percent}%)
    </Row>
    <Row style={{ marginTop: 10 }}>
      <Button
        type="primary"
        style={{ marginRight: 25 }}
        onClick={() => setIdCollateral(id)}
      >
        {t("components.loanListByAddress.actions.collateral")}
      </Button>
      <Button
        onClick={() => handleClickRepayment(id, amount)}
        disabled={disabledRepayment}
      >
        {t("components.loanListByAddress.actions.repayment")}
      </Button>
    </Row>
  </div>
);
