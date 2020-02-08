import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import { Form, Row, Result, Icon, Button } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import base64url from "base64url";
import config from "../../config";
import { redirect } from "../../utils";
import { useTranslation } from "react-i18next";

export const AssetPage = props => {
  const { t } = useTranslation();
  const aaActive = useSelector(state => state.aa.active);
  const activeInfo = useSelector(state => state.aa.activeInfo);
  const activeAssetRequest = useSelector(state => state.aa.activeAssetRequest);
  const hasAsset = activeInfo && "asset" in activeInfo;

  const handleClick = () => {
    const dataString = JSON.stringify({ define: 1 });
    const dataBase64 = base64url(dataString);
    redirect(
      `byteball${
        config.TESTNET ? "-tn" : ""
      }:${aaActive}?amount=10000&base64data=${dataBase64}`
    );
  };
  return (
    <Layout title={t("pages.asset.title")} page="asset">
      <Form>
        <Form.Item>
          <SelectAA />
        </Form.Item>
      </Form>
      <Row>
        {((aaActive && hasAsset) || activeAssetRequest) && (
          <Result
            status="success"
            title={t("pages.asset.status.success.title")}
            extra={
              <Link to="/" className="ant-btn ant-btn-primary ant-btn-lg">
                {t("pages.asset.status.success.button")}
              </Link>
            }
          />
        )}
        {aaActive && !hasAsset && !activeAssetRequest && (
          <Result
            icon={<Icon type="loading" />}
            title={t("pages.asset.status.pending.title")}
            subTitle={t("pages.asset.status.pending.subTitle")}
            extra={
              <Button onClick={handleClick} type="primary">
                {t("pages.asset.status.pending.button")}
              </Button>
            }
          />
        )}
      </Row>
    </Layout>
  );
};
