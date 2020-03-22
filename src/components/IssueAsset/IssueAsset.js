import React from "react";
import { Row, Result, Icon, Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";
import base64url from "base64url";
import { useTranslation } from "react-i18next";

import config from "../../config";
import { tokenRegistrySwitch } from "../../store/actions/deploy";

export const IssueAsset = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const active = useSelector(state => state.aa.active);
  const registryToken = useSelector(state => state.deploy.registryToken);
  const dataString = JSON.stringify({ define: 1 });
  const dataBase64 = base64url(dataString);

  return (
    <Row>
      <Result
        icon={<Icon type="loading" />}
        title={t("components.asset.status.pending.title")}
        extra={
          <a
            className="ant-btn ant-btn-primary"
            href={`obyte${
              config.TESTNET ? "-tn" : ""
            }:${active}?amount=10000&base64data=${dataBase64}`}
          >
            {t("components.asset.status.pending.button")}
          </a>
        }
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>Add an asset to the token registry? </div>
        <Switch
          style={{ marginLeft: 5, marginRight: 5 }}
          onChange={c => {
            dispatch(tokenRegistrySwitch(c));
          }}
          checked={registryToken}
        />
      </div>
    </Row>
  );
};
