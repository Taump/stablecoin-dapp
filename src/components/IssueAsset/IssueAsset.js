import React from "react";
import { Row, Result, Icon, Button } from "antd";
import { useSelector } from "react-redux";
import base64url from "base64url";
import config from "../../config";
import { redirect } from "../../utils";
import { useTranslation } from "react-i18next";

export const IssueAsset = () => {
  const { t } = useTranslation();
  const active = useSelector(state => state.aa.active);
  const dataString = JSON.stringify({ define: 1 });
  const dataBase64 = base64url(dataString);
  const handleClick = () => {
    redirect(
      `byteball${
        config.TESTNET ? "-tn" : ""
      }:${active}?amount=10000&base64data=${dataBase64}`
    );
  };
  return (
    <Row>
      <Result
        icon={<Icon type="loading" />}
        title={t("pages.home.asset.status.pending.title")}
        subTitle={t("pages.home.asset.status.pending.subTitle")}
        extra={
          <Button onClick={handleClick} type="primary">
            {t("pages.home.asset.status.pending.button")}
          </Button>
        }
      />
    </Row>
  );
};
